import express from 'express'
import Post from '../model/post.js'
import userAuth from '../controller/userAuth.js'

const router = express.Router()

function maskPhone(phone) {
  // keeps the last 2 digits visible, masks the rest — e.g. (555) 123-••89
  return phone.replace(/\d(?=\D*\d\D*\d\D*$)/g, '•')
}

function toPublicPost(post, viewerId) {
  const obj = post.toObject()
  const revealed = viewerId
    ? obj.revealedTo.some((id) => id.toString() === viewerId)
    : false

  return {
    id: obj._id,
    title: obj.title,
    story: obj.story,
    category: obj.category,
    congregation: obj.congregation,
    institutionName: obj.institutionName,
    amountNeeded: obj.amountNeeded,
    amountRaised: obj.amountRaised,
    contact: {
      neighborhood: obj.contact.neighborhood,
      city: obj.contact.city,
      phone: revealed ? obj.contact.phone : maskPhone(obj.contact.phone),
    },
    role: obj.role,
    contactRequests: obj.contactRequests,
    contactRevealed: revealed,
    postedBy: obj.postedBy,
    createdAt: obj.createdAt,
  }
}

// GET /api/posts?congregation=mosque&category=medical
router.get('/api/', async (req, res) => {
  try {
    const { congregation, category } = req.query
    const filter = {}
    if (congregation && congregation !== 'all') filter.congregation = congregation
    if (category && category !== 'all') filter.category = category

    const posts = await Post.find(filter).sort({ createdAt: -1 })
    res.status(200).json({ posts: posts.map((p) => toPublicPost(p, req.user?.id)) })
  } catch (error) {
    res.status(500).json({ message: 'Could not load posts.' })
  }
})

// GET /api/posts/:id
router.get('/api/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found.' })
    res.status(200).json({ post: toPublicPost(post, req.user?.id) })
  } catch (error) {
    res.status(500).json({ message: 'Could not load post.' })
  }
})

// POST /api/posts
router.post('/api/posts', userAuth, async (req, res) => {
  
  try {
    const {
      title,
      story,
      category,
      congregation,
      institutionName,
      amountNeeded,
      phone,
      neighborhood,
      city,
    } = req.body

    if (
      !title ||
      !story ||
      !institutionName ||
      !amountNeeded ||
      !phone ||
      !neighborhood ||
      !city
    ) {
      return res.status(400).json({
        message: 'Please fill in every field so the community can trust and verify this need.',
      })
    }

    const post = await Post.create({
      title,
      story,
      category,
      congregation,
      institutionName,
      amountNeeded,
      contact: { phone, neighborhood, city },
      postedBy: req.user.id,
      role: req.user.role
    })

    res.status(201).json({ post: toPublicPost(post, req.user.id) })
  } catch (error) {
    res.status(500).json({ message: 'Could not create post.' })
  }
})

// POST /api/posts/:id/donate
router.post('/api/posts/:id/donate', userAuth, async (req, res) => {
  try {
    const { amount } = req.body
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Enter a valid amount.' })
    }

    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found.' })

    post.amountRaised = Math.min(post.amountNeeded, post.amountRaised + amount)
    await post.save()

    res.status(200).json({ post: toPublicPost(post, req.user.id) })
  } catch (error) {
    res.status(500).json({ message: 'Could not process donation.' })
    console.log(error);
    
  }
})

// POST /api/posts/:id/contact-request
router.post('/api/posts/:id/contact-request', userAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found.' })

    const alreadyRevealed = post.revealedTo.some((id) => id.toString() === req.user.id)
    if (!alreadyRevealed) {
      post.revealedTo.push(req.user.id)
      post.contactRequests += 1
      await post.save()
    }

    res.status(200).json({ post: toPublicPost(post, req.user.id) })
  } catch (error) {
    res.status(500).json({ message: 'Could not request contact.' })
    console.log(error);
    
  }
})

export default router
