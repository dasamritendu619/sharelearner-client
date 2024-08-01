import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function ForkPost() {
    const navigate = useNavigate()
    const { postId } = useParams()
    if (!postId) {
        navigate('/')
    }
  return (
    <div>ForkPost</div>
  )
}
