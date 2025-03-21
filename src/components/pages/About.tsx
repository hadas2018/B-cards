import { FunctionComponent, useEffect, useState } from 'react';
import './AboutUs.css'; 

interface AboutProps {
    
}
 
const About: FunctionComponent<AboutProps> = () => {
    // State to track if screen is small
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        // Function to check screen size
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 768); // 768px is Bootstrap's small screen breakpoint
        };

        // Initial check
        checkScreenSize();

        // Add resize event listener
        window.addEventListener('resize', checkScreenSize);

        // Function to handle scroll animations
        const animateOnScroll = () => {
          const animatedElements = document.querySelectorAll('.animate__animated');
          
          // Set different threshold based on screen size
          const threshold = isSmallScreen ? 50 : 100;
          
          animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - threshold) {
              const animationClass = element.getAttribute('data-animation');
              if (animationClass) {
                element.classList.add(animationClass);
                element.classList.remove('animate__hidden');
              }
            }
          });
        };
    
        // Initial check for elements in viewport
        animateOnScroll();
        
        // Add scroll event listener
        window.addEventListener('scroll', animateOnScroll);
        
        // Clean up event listeners on component unmount
        return () => {
          window.removeEventListener('scroll', animateOnScroll);
          window.removeEventListener('resize', checkScreenSize);
        };
      }, [isSmallScreen]); // Re-run effect when isSmallScreen changes
    
      return (
        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="display-4 mb-3 animate__animated animate__hidden" data-animation="animate__fadeInDown">About Us</h1>
            <div className="border-bottom border-primary w-25 mx-auto mb-4 animate__animated animate__hidden" data-animation="animate__fadeIn" style={{ animationDelay: '0.3s' }}></div>
          </div>
          
          <section className="mb-5">
            <h2 className="text-primary mb-4 animate__animated animate__hidden" data-animation="animate__fadeInUp">Welcome to BCard</h2>
            <p className="lead animate__animated animate__hidden" data-animation="animate__fadeIn" style={{ animationDelay: '0.2s' }}>
              Your ultimate solution for creating, browsing, and managing business cards with ease. 
              Our innovative platform is designed to cater to professionals and businesses of all sizes, 
              offering a seamless and efficient way to handle all your business card needs.
            </p>
          </section>
          
          <section className="mb-5">
            <h2 className="text-primary mb-4 animate__animated animate__hidden" data-animation="animate__fadeInUp">Our Mission</h2>
            <p className="animate__animated animate__hidden" data-animation="animate__fadeIn" style={{ animationDelay: '0.2s' }}>
              At BCard, we strive to simplify the way you network and manage your professional connections. 
              Our mission is to provide a user-friendly, powerful tool that helps you create stunning business cards, 
              efficiently manage your contacts, and enhance your professional presence.
            </p>
          </section>
          
          <section className="mb-5">
            <h2 className="text-primary mb-4 animate__animated animate__hidden" data-animation="animate__fadeInUp">What We Offer</h2>
            
            <div className="row g-4 mt-3">
              <div className="col-md-4 animate__animated animate__hidden" data-animation="animate__zoomIn" style={{ animationDelay: '0.1s' }}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title h4 text-primary">Create</h3>
                    <p className="card-text">
                      Design unique and professional business cards effortlessly with our intuitive creation tools. 
                      Choose from a variety of templates, customize every detail, and ensure your business card stands out.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 animate__animated animate__hidden" data-animation="animate__zoomIn" style={{ animationDelay: '0.3s' }}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title h4 text-primary">Browse</h3>
                    <p className="card-text">
                      Explore a wide range of business cards within our app. Find inspiration, discover new contacts, 
                      and connect with professionals from various industries.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 animate__animated animate__hidden" data-animation="animate__zoomIn" style={{ animationDelay: '0.5s' }}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title h4 text-primary">CRM for Admins</h3>
                    <p className="card-text">
                      Our comprehensive CRM features enable admins to manage business card data, users data, 
                      and maintain valuable business relationships. Stay on top of your networking game with 
                      advanced analytics and reporting tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-5">
            <h2 className="text-primary mb-4 animate__animated animate__hidden" data-animation="animate__fadeInUp">Contact Us</h2>
            <div className="card shadow-sm animate__animated animate__hidden" data-animation="animate__fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <h4 className="h5">Email</h4>
                    <p>BCard@email.com</p>
                  </div>
                  <div className="col-md-4 mb-3 mb-md-0">
                    <h4 className="h5">Phone</h4>
                    <p>123-456-7890</p>
                  </div>
                  <div className="col-md-4">
                    <h4 className="h5">Address</h4>
                    <p>1234 BCard St, BCard City, BCard Country</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    };
export default About;