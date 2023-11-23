import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { IconButton, useMediaQuery, useTheme, Link, Box } from "@mui/material";
import {
  FacebookOutlined,
  Twitter,
  Instagram,
  LinkedIn,
  GitHub,
} from "@mui/icons-material";
import AOS from "aos";
import "aos/dist/aos.css";

type DoctorProps = {
  id: number;
  imageUrl: string;
  position: string;
  media: MediaObject;
  name: string;
};

type MediaObject = {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  link?: string;
};

function DoctorComponent({ position, name, media, imageUrl }: DoctorProps) {
  const mytheme = useTheme();
  const lessThanTab = useMediaQuery(mytheme.breakpoints.down("md"));

  const aboutImgWidth = lessThanTab ? "100vw" : "50vw";

  React.useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <Box
      bgcolor={mytheme.palette.mode === "dark" ? "#381E72" : "white"}
      data-aos="zoom-in"
      className="shadow-lg  rounded-md dark:shadow-lg"
    >
      <CardContent>
        <img
          alt="Memeber"
          className="rounded"
          style={{ width: aboutImgWidth, aspectRatio: "1" }}
          src={imageUrl}
        />
        <div className="flex flex-row justify-center items-center pb-3">
          {media.facebook && (
            <Link target="_blank" href={media.facebook}>
              <IconButton aria-label="link to facebook">
                <FacebookOutlined />
              </IconButton>
            </Link>
          )}
          {media.twitter && (
            <Link target="_blank" href={media.twitter}>
              <IconButton aria-label="link to twitter">
                <Twitter />
              </IconButton>
            </Link>
          )}
          {media.instagram && (
            <Link target="_blank" href={media.instagram}>
              <IconButton aria-label="link to instagram">
                <Instagram />
              </IconButton>
            </Link>
          )}
          {media.github && (
            <Link target="_blank" href={media.github}>
              <IconButton size="medium" aria-label="link to github">
                <GitHub />
              </IconButton>
            </Link>
          )}

          {media.linkedin && (
            <Link target="_blank" href={media.linkedin}>
              <IconButton aria-label="link to face book">
                <LinkedIn />
              </IconButton>
            </Link>
          )}
        </div>
        <Typography
          fontFamily="Poppins-Medium"
          className="font-poppinsLight text-center text-sm md:text-2md"
          gutterBottom
        >
          {name}
        </Typography>

        <Typography
          fontFamily="Poppins-Light"
          className="font-poppinsLight text-center text-sm md:text-2md"
        >
          {position}
        </Typography>
      </CardContent>
    </Box>
  );
}

function DoctorsComponent() {
  const DoctorS: DoctorProps[] = [
    {
      id: 1,
      imageUrl: "/isaac.png",
      position: "Chief Executive Officer",
      name: "Isaac Johnson",
      media: {
        facebook: "https://www.facebook.com/profile.php?id=100015138280039",
        twitter: "https://twitter.com/IsaacCEJohnson2",
        instagram: "https://www.instagram.com/super_jay06",
        linkedin: "https://www.linkedin.com/in/isaac-johnson-b50875167/",
        github: "https://github.com/ICEJ-jr",
      },
    },
    {
      id: 2,
      imageUrl: "/shelp_profile.png",
      position: "Chief Operating Officer",
      name: "Mohamed Shelpidy Kamara",
      media: {
        facebook: "https://www.facebook.com/profile.php?id=100008312778585",
        twitter: "https://twitter.com/medshelpidy",
        instagram: "https://www.instagram.com/shelpidy/",
        linkedin: "https://www.linkedin.com/in/mohamed-kamara-6894b1230/",
        github: "https://github.com/Shelpidy",
      },
    },
    {
      id: 3,
      imageUrl: "/Afa-pearl.png",
      position: "Lead UI/UX Designer",
      name: "Afanwi Pearl",
      media: {
        facebook: " https://www.facebook.com/afanwi.pearl.9",
        twitter: " https://twitter.com/AfanwiPearl",
        instagram: "https://instagram.com/afanwi_pearl?igshid=YmMyMTA2M2Y=",
        linkedin: " https://www.linkedin.com/in/afanwi-pearl-94112a1aa/",
        github: "",
      },
    },
    {
      id: 4,
      imageUrl: "/hamed.png",
      position: "Lead Mobile Developer",
      name: "Hamed Kemokai",
      media: {
        facebook: " https://www.facebook.com/hamedkemokai1",
        twitter: "https://twitter.com/Ing_hamed",
        instagram: "",
        linkedin: "https://www.linkedin.com/in/hamed-idriss-kemokai-57299b104/",
        github: "",
      },
    },
  ];

  return (
    <div className="pt-5 px-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {DoctorS.map((item: DoctorProps, index: number) => {
        return <DoctorComponent key={item.id} {...item} />;
      })}
    </div>
  );
}

export default DoctorsComponent;
