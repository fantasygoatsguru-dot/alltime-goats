// src/components/ImageSpinner.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Box } from "@mui/material";

const ImageSpinner = ({ size = 24 }) => {
    // Expanded array of NBA player icons
const images = [
  "https://www.fantasygoats.guru/media/ai-step-min.png",
  "https://www.fantasygoats.guru/media/air_jordan-min.png",
  "https://www.fantasygoats.guru/media/bron_jr-min.png",
  "https://www.fantasygoats.guru/media/bron_wade-min.png",
  "https://www.fantasygoats.guru/media/chalk-min.png",
  "https://www.fantasygoats.guru/media/choke_reggie-min.png",
  "https://www.fantasygoats.guru/media/doctor_j-min.png",
  "https://www.fantasygoats.guru/media/draymond_kick-min.png",
  "https://www.fantasygoats.guru/media/dream_team-min.png",
  "https://www.fantasygoats.guru/media/duncan-min.png",
  "https://www.fantasygoats.guru/media/goat.png",
  "https://www.fantasygoats.guru/media/jah-min.png",
  "https://www.fantasygoats.guru/media/kareem_sky_hook-min.png",
  "https://www.fantasygoats.guru/media/kawhi-min.png",
  "https://www.fantasygoats.guru/media/kobe-min.png",
  "https://www.fantasygoats.guru/media/kobe_dunk-min.png",
  "https://www.fantasygoats.guru/media/kobe_mj-min.png",
  "https://www.fantasygoats.guru/media/kyrie-steph-min.png",
  "https://www.fantasygoats.guru/media/kyries-min.png",
  "https://www.fantasygoats.guru/media/manu_bat-min.png",
  "https://www.fantasygoats.guru/media/media.gif",
  "https://www.fantasygoats.guru/media/mj_pippen-min.png",
  "https://www.fantasygoats.guru/media/nick_young-min.png",
  "https://www.fantasygoats.guru/media/ray_allen-min.png",
  "https://www.fantasygoats.guru/media/shakobe-min.png",
  "https://www.fantasygoats.guru/media/shaq_nets-min.png",
  "https://www.fantasygoats.guru/media/shaq_point-min.png",
  "https://www.fantasygoats.guru/media/shrug-min.png",
  "https://www.fantasygoats.guru/media/stephen-jackson-nose-pick-min.png",
  "https://www.fantasygoats.guru/media/the_shot-min.png",
  "https://www.fantasygoats.guru/media/wilt-min.png",
  "https://www.fantasygoats.guru/media/wilt_bill_russel-min.png"
];
    // Function to shuffle the array
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // State for the randomized image list and current index
    const [shuffledImages, setShuffledImages] = useState(shuffleArray(images));
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Cycle through images every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % shuffledImages.length);
        }, 2000); // Change image every 2 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [shuffledImages.length]);

    // Re-shuffle images when the component mounts or size changes
    useEffect(() => {
        setShuffledImages(shuffleArray(images));
        setCurrentImageIndex(0); // Reset to first image after shuffle
    }, [size]); // Re-shuffle if size prop changes (optional)

    return (
        <Box
            sx={{
                width: size,
                height: size,
                overflow: "hidden",
                borderRadius: "50%", // Circular frame
            }}
        >
            <motion.img
                key={currentImageIndex} // Key ensures animation restarts with each image change
                src={shuffledImages[currentImageIndex]}
                alt="Loading Indicator"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                initial={{ scale: 1 }} // Start at normal size
                animate={{ scale: [1, 1.2, 1] }} // Pulse: scale up to 1.2 then back to 1
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} // Pulse every 0.8 seconds
            />
        </Box>
    );
};

export default ImageSpinner;