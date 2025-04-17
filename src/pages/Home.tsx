import React from 'react'
import FloatingVideoCallCard from '../components/card/Card'
import { useRoom } from '../context/RoomContext';
import Loader from '../components/Loader';

const Home = () => {

  const { isLoading } = useRoom();

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-900">
      <FloatingVideoCallCard />
      <Loader show={isLoading} text="Conectando a la videollamada..." />
    </div>
  )
}

export default Home