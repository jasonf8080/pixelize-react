import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LiaTimesSolid } from "react-icons/lia";
import { FaArrowLeftLong, FaArrowRightLong} from "react-icons/fa6";
import { FaHeart } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

import { VscHeartFilled } from "react-icons/vsc";
import { FiDownload } from "react-icons/fi";
import { useGlobalContext } from '../context';



const Photo = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false)
    const [imageData, setImageData] = useState({})
    const [isLiked, setIsLiked] = useState(false)
    const [justLiked, setJustLiked] = useState(false)

    const {setActiveCategory, setQueryObject} = useGlobalContext();

    
    const fetchPhoto = async() => {
      setLoading(true)
      try {
        const response = await fetch(`https://api.unsplash.com//photos/${id}?client_id=${process.env.REACT_APP_API_KEY}`);
        const data = await response.json();

        console.log(data)

        const {
          user:{profile_image:{medium: profile_picture}, username},
          urls:{regular: image},
          slug,
          description,
          alt_description,
          created_at,
          downloads, 
          likes,
          tags,
        } = data;

        //Handle Date Format
        const inputDate = new Date(created_at);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = inputDate.toLocaleDateString('en-US', options);


        setImageData({
          profile_picture,
          username,
          image,
          slug,
          description,
          alt_description,
          created_at: formattedDate,
          downloads,
          likes,
          tags
        })
      
       setLoading(false)
        
      } catch(error) {
        console.log(error)
        // setLoading(false)
      }
    }


    const returnToHome = () => {
      navigate(-1)
    }

    const handleLike = () => {
      if(justLiked){
        return
      }
      
      setIsLiked(!isLiked)

      if(isLiked){
       setImageData({...imageData, likes: imageData.likes - 1 })

      } else {
        setImageData({...imageData, likes: imageData.likes + 1 })
        setJustLiked(true)

        setTimeout(() => {
          setJustLiked(false)
        }, 1000);
      }
    }

    const handleDownload = () => {
  
      const link = document.createElement('a')
      link.href = imageData.image;
      link.download = imageData.slug;

      link.click();
    
    }

    const handleTagClick = (item) => {
      setActiveCategory(null)
      setQueryObject({tempQuery: item, query: item, newQuery: true})
      navigate('/')
    }

    

    useEffect(() => {
      window.scrollTo(0,0)
        fetchPhoto();
    }, [id])
  
  return (
    
   <section className='max-w-7xl mx-auto p-5 md:p-10 dark:text-white'>
        <button className='text-3xl md:text-4xl' onClick={returnToHome}><LiaTimesSolid/></button>
        <div className="max-w-full mx-auto mt-5">

          <div className="max-w-[700px] min-h-[300px] md:min-h-[700px]  mx-auto">
            {loading ? <div className="skeleton-loader rounded-lg min-h-[300px] md:min-h-[700px]"></div>
             : 
              <img src={imageData.image} className='mx-auto max-w-full min-w-full h-auto rounded-lg' alt=""/>
            }
          </div> 

          <div className='max-w-[700px] mx-auto'>
                {/* Profile Picture and Username / Like and Download */}
                <div className="mt-6 flex flex-col-reverse justify-between  md:flex-row  md:items-center w-full">

                    <Link className='flex items-center mt-4 md:mt-0' to={`/profile/${imageData.username}`}>
                     {loading ? <div className="skeleton-loader max-w-[40px] max-h-[40px] min-w-[40px] min-h-[40px]  md:min-w-[45px] md:min-h-[45px]  md:max-w-[45px] md:max-h-[45px] rounded-full"></div> 
                       : <img src={imageData.profile_picture}
                       className="w-[40px] md:w-[45px] h-auto rounded-full" alt="" 
                      />
                      }

                      <h1 className='text-lg md:text-xl ml-3 md:ml-5'>{loading ? 'Loading...' : imageData.username}</h1>
                    </Link>

                    
                    <div className='flex items-center translate-y-[-6px]'>
                        <button disabled={justLiked}
                          id="like-btn" 
                          className="mr-2 rounded-full w-[40px] h-[40px] md:w-[45px] md:h-[45px] flex justify-center items-center 
                           bg-transparent border-[1px] border-[#ddd] dark:border-[#333] text-black dark:text-white shadow-lg dark:shadow-[#000000]"
                          onClick={handleLike}
                          >
                          <span className={`${!isLiked ? 'text-black dark:text-white' : 'text-red-500'} text-xl md:text-2xl`}>{<VscHeartFilled/>}</span>
                        </button>

                        <button
                          id="download-btn" 
                          className="rounded-full w-[40px] h-[40px] md:w-[45px] md:h-[45px] flex justify-center items-center
                            bg-transparent border-[1px] border-[#ddd] dark:border-[#333] text-black dark:text-white shadow-lg dark:shadow-[#000000]"
                            onClick={handleDownload}>
                          <span className='text-xl md:text-2xl'>{<FiDownload/>}</span>
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className='mt-8  ml-6'>{loading ? 'Loading...' : imageData.description || imageData.alt_description}</p>

                  {/* Likes and Downloads */}
                  <div className='mt-8 ml-6'>
                    <p className={`${justLiked && 'text-red-500'} flex items-center mb-3 duration-200`}>
                      <span className='mr-2 text-lg md:text-xl mb-[4px]'><VscHeartFilled/></span>
                      <span className='mr-[4px] text-md md:text-lg'>{loading ? 'Loading...' : imageData.likes}</span>
                      {loading ? '' : 'Likes'}
                    </p>

                    <p className='flex items-center'>
                      <span className='mr-2 text-lg md:text-xl mb-[4px]'><FiDownload/></span>
                      <span className='mr-[4px] text-md md:text-lg'>{loading ? 'Loading...' : imageData.downloads}</span> 
                        {loading ? '' : 'Downloads'}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className='mt-6 md:mt-10 border-b-[2px] border-secondary-color dark:border-main-color py-6'>
                    {imageData.tags && imageData.tags.length > 1 && imageData.tags.map((item, index) => {
                      return (
                      <button className='uppercase mr-3 mb-3 
                      border-[1px] border-[#ddd]
                      dark:border-[#333] text-black
                      dark:text-white 
                      shadow-lg dark:shadow-[#000]
                      px-4 md:px-6 py-2 rounded-md text-xs md:text-sm 
                      hover:bg-secondary-color hover:text-white hover:border-secondary-color
                      dark:hover:bg-main-color dark:hover:border-main-color' 
                      onClick={() => handleTagClick(item.title)}
                      >
                        {`# ${item.title}`}
                      </button>
                      )
                    })}
                  </div>

                  {/* Date Posted */}
                  <p className='mt-6 md:mt-12 text-sm'>Posted: {imageData.created_at}</p>
              </div>
        </div>
      
   </section>
  )
}


export default Photo