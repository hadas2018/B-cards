import { FunctionComponent, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {}

const ScrollToToop: FunctionComponent<ScrollToTopProps> = () => {
   

        const { pathname } = useLocation();
  
        useEffect(() => {
          window.scrollTo(0, 0);
        }, [pathname]);
        
        return null;
      };

 
export default ScrollToToop;