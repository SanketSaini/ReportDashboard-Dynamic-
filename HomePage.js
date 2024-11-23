import React, { useState, useEffect } from 'react';
import { Button, Container, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate(); 

  // Array of text lines
  const textLines = [
    "Empowering your data with intelligent insights and actionable analytics.",
    "Transforming raw data into powerful business intelligence.",
    "Unlock the potential of your data with precision analytics.",
    "From data to decisions – smarter, faster, better.",
    "Your go-to platform for intelligent data insights and reporting."
  ];


  const backgroundImages = [
    '/images/1-min.jpg',
    '/images/2-min.jpg',
    '/images/6-min.jpg',
    '/images/7-min.jpg',
    '/images/8-min.jpg',
    '/images/9-min.jpg'
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Change text and image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textLines.length);
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // 5 seconds transition

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Handle click to navigate to the Dashboard
  const handleUploadClick = () => {
    navigate('/dashboard'); // Navigate to the Dashboard page
  };

  return (
    <div>
 
      <Container
        className="homepage-content"
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
          backgroundSize: 'cover',        
          backgroundPosition: 'center',  
          backgroundAttachment: 'fixed', 
          backgroundRepeat: 'no-repeat',  
          height: '75vh',                
          width: '2000vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white',
          transition: 'background-image 1s ease-in-out',  
        }}
      >

        <div className="overlay">
          <div>
            {/* Transitioning Text */}
            <h1>{textLines[currentTextIndex]}</h1>

            {/* Upload CSV Button in the center */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleUploadClick}
              className="upload-button"
            >
              Get Started
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
