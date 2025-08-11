"use client";

import { useEffect, useState, useRef } from "react";
import "./slider.css";

interface CardProps {
  id: number;
  imageUrl: string;
}

const cards: CardProps[] = [
  {
    id: 1,
    imageUrl: "/images/card1.svg",
  },
  {
    id: 2,
    imageUrl: "/images/card2.svg",
  },
  {
    id: 3,
    imageUrl: "/images/card3.svg",
  },
];

export default function SliderPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Function to handle Bootstrap initialization
  useEffect(() => {
    // Import Bootstrap JS only on client side
    // Using dynamic import with type assertion to avoid TypeScript errors
    (async () => {
      try {
        await import("bootstrap/dist/js/bootstrap.bundle.min.js");
      } catch (err) {
        console.error("Error loading Bootstrap JS:", err);
      }
    })();
  }, []);

  // Function to handle dot navigation
  const handleDotClick = (index: number) => {
    if (isTransitioning || index === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(index);

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with your CSS transition duration
  };

  // Function to get card class based on its position relative to active card
  const getCardClass = (index: number) => {
    // Calculate the relative position considering infinite scrolling
    const totalCards = cards.length;
    const relativePosition =
      (((index - activeIndex) % totalCards) + totalCards) % totalCards;

    if (relativePosition === 0) return "active";
    if (relativePosition === 1 || relativePosition === totalCards - 1)
      return "adjacent";
    return "hidden";
  };

  // Function to get card position style
  const getCardStyle = (index: number) => {
    const totalCards = cards.length;
    const relativePosition =
      (((index - activeIndex) % totalCards) + totalCards) % totalCards;

    if (relativePosition === 0) {
      // Active card - centered
      return { zIndex: 3, transform: "translateX(0) scale(1)" };
    } else if (relativePosition === 1) {
      // Next card - right side
      return { zIndex: 2, transform: "translateX(100%) scale(0.85)" };
    } else if (relativePosition === totalCards - 1) {
      // Previous card - left side
      return { zIndex: 2, transform: "translateX(-100%) scale(0.85)" };
    } else {
      return { zIndex: 1, transform: "translateX(0) scale(0.8)", opacity: 0 };
    }
  };
  
  // Function to get card label
  const getCardLabel = (index: number) => {
    const totalCards = cards.length;
    const relativePosition =
      (((index - activeIndex) % totalCards) + totalCards) % totalCards;

    if (relativePosition === 0) {
      return "Current";
    } else if (relativePosition === 1) {
      return "Next";
    } else if (relativePosition === totalCards - 1) {
      return "Previous";
    } else {
      return "";
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Infinite Card Slider</h1>

      <div className="slider-container position-relative" ref={sliderRef} style={{ maxWidth: "1200px", margin: "0 auto", overflow: "visible" }}>
        <div
          className="cards-wrapper position-relative"
          style={{ height: "300px" }}
        >
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`slider-card position-absolute ${getCardClass(
                index
              )}`}
              style={{
                ...getCardStyle(index),
                transition: "all 0.5s ease",
                height: "250px",
                maxWidth: "430px",
                width: "100%",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                top: "0",
                left: "0",
                right: "0",
                margin: "0 auto",
                position: "relative",
              }}
            >
              <img 
                src={card.imageUrl} 
                alt={`Card ${card.id}`} 
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              {/* Card label */}
              {getCardLabel(index) && (
                <div
                  className="card-label position-absolute"
                  style={{
                    top: "10px",
                    left: "0",
                    right: "0",
                    textAlign: "center",
                    padding: "5px 10px",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "5px",
                    margin: "0 auto",
                    width: "fit-content",
                  }}
                >
                  {getCardLabel(index)}
                </div>
              )}
              {/* Direction indicators */}
              {getCardLabel(index) === "Next" && (
                <div
                  className="direction-indicator position-absolute"
                  style={{
                    left: "0",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "15px",
                    borderRadius: "50%",
                    fontSize: "24px",
                    zIndex: 10,
                  }}
                >
                  ➡️
                </div>
              )}
              {getCardLabel(index) === "Previous" && (
                <div
                  className="direction-indicator position-absolute"
                  style={{
                    right: "0",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "15px",
                    borderRadius: "50%",
                    fontSize: "24px",
                    zIndex: 10,
                  }}
                >
                  ⬅️
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dots navigation */}
        <div className="dots-container d-flex justify-content-center mt-4">
          {cards.map((_, index) => (
            <button
              key={index}
              className={`dot mx-2 ${index === activeIndex ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: index === activeIndex ? "#007bff" : "#ccc",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
