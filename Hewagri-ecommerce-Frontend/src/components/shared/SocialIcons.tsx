import Link from "next/link";
import React from "react";
import { IconContext } from "react-icons";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaThreads, FaXTwitter } from "react-icons/fa6";

interface Props {
  size?: number;
  color?: string;
}

const SocialIcons = ({ size, color }: Props) => {
  const social = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/kivugreen",
      icon: FaInstagram,
    },
    { name: "Twitter", href: "https://x.com/kivugreencorp", icon: FaXTwitter },
    {
      name: "Linkedin",
      href: "https://www.linkedin.com/company/kivugreen-corporation/posts/?feedView=all",
      icon: FaLinkedin,
    },
    // { name: "Threads", href: "https://www.threads.net", icon: FaThreads },
    {
      name: "Facebook",
      href: "https://www.facebook.com/KivuGreen/",
      icon: FaFacebookF,
    },
  ];

  return (
    <div className="inline-flex items-center justify-start space-x-5 notranslate">
      {social.map((item, index) => (
        <Link key={index} href={item.href} target="_blank">
          <span className="sr-only">{item.name}</span>
          <IconContext.Provider
            value={{
              className:
                "text-yellow-300 text-[16px] hover:text-white hover:scale-110 trasition-all duration-100 ease-in-out",
            }}
          >
            <item.icon size={size} color={color} />
          </IconContext.Provider>
        </Link>
      ))}
    </div>
  );
};

export default SocialIcons;
