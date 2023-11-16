'use client'
import withAuth from "@/hocs/WithAuth"

const Home = () => {
  return (
    <div>
      Home page
    </div>
  )
}

export default withAuth(Home)