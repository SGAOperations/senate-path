import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowDown } from 'react-icons/fa'; // Import the arrow icon
import frontPageImage from '../../assets/front-page.jpg';

const Home: React.FC = () => {
  const navigate = useNavigate(); // Hook to handle navigation

  const handleScrollToSGA = () => {
    const sgaSection = document.getElementById('sga-section');
    if (sgaSection) {
      sgaSection.scrollIntoView({ behavior: 'smooth' }); 
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          position: 'relative',
          height: '90vh', 
          width: '100vw', 
          overflow: 'hidden',
        }}
      >
        {/* Background Image */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -2,
          }}
        >
          <img
            src={frontPageImage}
            alt="Front Page"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.44)', 
            zIndex: -1,
          }}
        ></div>

        {/* Content Overlay */}
        <div
          style={{
            position: 'relative', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%', 
            textAlign: 'center',
            color: 'white',
            zIndex: 1, 
          }}
        >
          <h1
            style={{
              fontSize: '3.5rem',
              fontStyle: 'italic',
              fontWeight: 'bold',
              textShadow: '7px 7px 10px rgba(0, 0, 0, 0.8)', 
              margin: 0,
            }}
          >
            SENATE NOMINATIONS & APPLICATIONS
          </h1>
          <p
            style={{
              fontSize: '1.5rem',
              margin: '10px 0',
              fontWeight: 'bold',
              textShadow: '5px 5px 7px rgba(0, 0, 0, 0.7)', 
            }}
          >
            NORTHEASTERN'S STUDENT GOVERNMENT ASSOCIATION
          </p>

          {/* Buttons Container */}
          <div
            style={{
              marginTop: '25px',
              display: 'flex', 
              gap: '20px', 
              justifyContent: 'center',
            }}
          >
            <button
              style={{
                padding: '15px 25px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: '#C8102E',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',transition: 'background-color 0.3s ease', // Smooth transition for hover effect
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A00E24')} // Darker red on hover
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#C8102E')} // Reset to original color
              onClick={() => navigate('/applications')} // Navigate to Nominations
            >
              Apply
            </button>

            <button
  style={{
    padding: '15px 25px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#C8102E',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease', // Smooth transition for hover effect
  }}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A00E24')} // Darker red on hover
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#C8102E')} // Reset to original color
  onClick={() => navigate('/nominations')} // Navigate to Nominations
>
  Nominate
</button>
          </div>
        </div>

        {/* Arrow Icon at the Bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px', 
            left: '50%',
            transform: 'translateX(-50%)', 
            cursor: 'pointer',
            zIndex: 1,
          }}
          onClick={handleScrollToSGA} 
        >
          <FaArrowDown size={30} color="white" />
        </div>
      </div>

      {/* Who We Are and Why Senator */}
      <div
        id="sga-section" // Add ID for smooth scrolling
        style={{
          backgroundColor: '#f9f9f9',
          padding: '50px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '1050px',
            margin: '0 auto',
          }}
        >
          {/* What's SGA Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h1
              style={{
                fontSize: '3rem',
                fontStyle: 'italic',
                fontWeight: 'bold',
                marginRight: '8px',
                whiteSpace: 'nowrap',
                marginBottom: '0',
              }}
            >
              WHAT IS SGA
            </h1>
            <div
              style={{
                height: '4px', // Thicker line
                flex: 1, // Stretch the line to fill remaining space
                backgroundColor: 'black',
                borderRadius: '50px', // Make the line rounded
                marginTop: '35px',
                marginLeft: '15px',
              }}
            ></div>
            
          </div>
          
          <p style={{ lineHeight: '1.5', fontSize: '1rem', marginBottom: '20px' }}>
            The Northeastern University Student Government Association (or SGA for short)
            is the representative body serving over 15,000 undergraduate students and to
            change our Boston campus for the better. We take on different projects and
            initiatives, write legislation, and advocate to members of the University
            administration to improve student life, classroom programs, and the overall
            Northeastern Boston campus undergraduate experience.
          </p>
          <a
  style={{
    padding: '10px 12px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#C8102E',
    border: 'none',
    borderRadius: '5px',
    textDecoration: 'none', 
    display: 'inline-block', 
    cursor: 'pointer',
    transition: 'background-color 0.3s ease', // Smooth transition for hover effect
  }}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A00E24')} // Darker red on hover
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#C8102E')} // Reset to original color
  href="https://www.northeasternsga.com/senate" 
  target="_blank" 
  rel="noopener noreferrer" 
>
  About the Senate
</a>



          {/* Why Senator Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end', 
              marginTop:'0px', 
            }}
          >
            <div
              style={{
                height: '4px',
                flex: 1,
                backgroundColor: 'black',
                borderRadius: '50px',
                marginRight: '20px',
                marginTop: '35px',
              }}
            ></div>
            <h2
              style={{
                fontSize: '3rem',
                fontStyle: 'italic',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                marginBottom: '0',
                marginLeft: '8px',
              }}
            >
              WHY BE A SENATOR
            </h2>
          </div>
          <p style={{ lineHeight: '1.5', fontSize: '1rem', marginBottom: '20px' }}>
            
Becoming a senator offers the chance to represent the student body, advocate for their concerns, and shape the future of campus life. Senators propose legislation, approve budgets, and influence university policies. They work collaboratively to address critical issues and implement meaningful, lasting changes. If you’re passionate about leadership, representation, and driving impactful change, this role is for you. </p>
     
<a
  style={{
    padding: '10px 12px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#C8102E',
    border: 'none',
    borderRadius: '5px',
    textDecoration: 'none', // Remove underline from the link
    display: 'inline-block', // Ensure padding is applied like a button
    cursor: 'pointer',
    transition: 'background-color 0.3s ease', // Smooth transition for hover effect
  }}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A00E24')} // Darker red on hover
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#C8102E')} // Reset to original color
  href="https://www.northeasternsga.com/become-a-senator" 
  target="_blank" 
  rel="noopener noreferrer" 
>
  Requirements & Responsibilities
</a>

</div>
         
        </div>
        
      </div>

  );
};

export default Home;
