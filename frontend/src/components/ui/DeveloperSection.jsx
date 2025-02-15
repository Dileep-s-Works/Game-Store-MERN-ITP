import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@nextui-org/react";
import { BackgroundBeams } from "../../components/ui/BackgroundBeams";
import { useNavigate } from "react-router-dom";

const IndieDeveloperSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="py-16 relative overflow-hidden"
    >
      <BackgroundBeams />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div variants={itemVariants} className="md:w-1/2 mb-8 md:mb-0">
            <motion.h2
              variants={itemVariants}
              className="text-[50px] font-bold text-white mb-4"
            >
              Calling All Indie Developers
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-[30px] text-gray-300 mb-6"
            >
              Join our platform and showcase your games to a passionate
              community of gamers. We provide the tools and support you need to
              succeed.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button
                color="secondary"
                size="lg"
                onClick={() => handleClick("/login")}
              >
                Join as a Developer
              </Button>
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants} className="md:w-1/2">
            <img
              src="https://res.cloudinary.com/dhcawltsr/image/upload/v1728889325/DALL_E_2024-10-14_12.31.58_-_Create_a_3D_cartoon-style_character_of_an_indie_game_developer_with_a_violet_theme._The_character_should_appear_creative_and_focused_with_a_computer_wouh8i.webp"
              alt="Indie Developer"
              className="rounded-[250px] w-[500px] ml-[100px]"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default IndieDeveloperSection;
