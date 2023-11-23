import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";

interface TextShortenerProps {
  text: string;
  textLength: number;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  children?: React.ReactNode;
  showViewMore?: boolean;
  onPressViewMore?: () => void;
}

const TextShortener: React.FC<TextShortenerProps> = ({
  text,
  textLength,
  style,
  containerStyle,
  children,
  showViewMore,
  onPressViewMore,
}) => {
  const [shortenText, setShortenText] = useState("");
  const [loading, setLoading] = useState(true);
  const [_style, _setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    let txts = text.slice(0, textLength);
    if (text.length <= textLength) {
      setShortenText(text);
    } else {
      setShortenText(txts);
    }
    if (style) {
      _setStyle(style);
    }
    setLoading(false);
  }, [textLength, text, style]);

  if (loading) return <Typography>......</Typography>;

  return (
    <Box style={containerStyle}>
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: shortenText }}
        style={_style}
      >
        {showViewMore && (
          <Typography
            component="span"
            onClick={onPressViewMore}
            sx={{ color: "primary.main", cursor: "pointer" }}
          >
            view more
          </Typography>
        )}
      </Typography>
      {children}
    </Box>
  );
};

export default TextShortener;
