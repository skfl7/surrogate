import {
  Avatar,
  Box,
  Chip,
  Paper,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';
import ArrowForwardIosIcon from '../../../assets/icons/homeRightBlutArror.svg';
import '../card/Card.scss';
import edit_icon from '../../../assets/icons/edit_icon.svg';
import delete_icon from '../../../assets/icons/delete_icon.svg';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
type dataType = {
  image: string;
  text_one?: string;
  text_two?: string;
  text_three?: string;
  mainContent?: string;
}[];
type cardItems = {
  title: string;
  clipText?: string;
  clipNo?: any;
  data: dataType;
  mainImage?: string;
  key?: string;
  path?: string;
};

function Card({ content }: { content: cardItems }) {
  const navigate = useNavigate();
  const handlePath = (value: any) => {
    navigate(value);
  };
  const StyledChip = styled(Chip)(() => ({
    color: '#0662B7',
    backgroundColor: '#EEF7FF',
    fontFamily: 'Ilisarniq',
    height: '24px',
    fontSize: '12px',
    Width: '87px',
  }));

  return (
    <Paper
      elevation={3}
      sx={
        content.title != 'Frequent Activities'
          ? { width: '100%', maxHeight: '100vh' }
          : { width: '100%' }
      }
      className="card-container"
    >
      <Stack className="header-container">
        <Box>
          <Typography className="header-container-text">
            {content.title}
          </Typography>
        </Box>
        {content.clipText && (
          <Box>
            <StyledChip
              avatar={
                <Avatar className="avatarHome">
                  <Box className="avatarHome-flex-box">{content.clipNo}</Box>
                </Avatar>
              }
              label={content.clipText}
            />
          </Box>
        )}
      </Stack>
      <Stack className="homeUnderline"></Stack>
      {/* <Divider variant="middle" /> */}
      {/* If we want third box to scroll sx={{ overflowY: 'auto', maxHeight: '540px' }} */}
      <Box>
        {content.data.map((item: any) => {
          return (
            <Box
              // sx={{ overflowY: 'auto', maxHeight: '400px',backgroundColor:'pink' }}
              className="list-box"
              sx={{
                padding: content.mainImage
                  ? '1rem 1.3rem 1rem 1.5rem'
                  : '1.1rem 1rem',
              }}
              key={item.text_one || item.mainContent}
            >
              <Box>
                <img
                  src={item.image}
                  alt="action"
                  style={{ width: '40px', height: '40px' }}
                />
              </Box>
              {!item.mainContent && (
                <Box sx={{ width: '70%' }}>
                  <Typography
                    className="card-head"
                    sx={{ paddingBottom: '6px' }}
                  >
                    {item.text_one}
                  </Typography>
                  {item.text_three !== '' && (
                    <Typography
                      className="card-head"
                      sx={{ paddingBottom: '6px' }}
                    >
                      {item.text_three}
                    </Typography>
                  )}
                  <Typography className="card-subhead">
                    {item.text_two}
                  </Typography>
                </Box>
              )}
              {item.mainContent && (
                <Box className="main-content">
                  <Typography className="card-head">
                    {item.mainContent}
                  </Typography>
                </Box>
              )}
              {content.key !== 'savedItems' && (
                <Box
                  className="flex-class"
                  onClick={() => handlePath(item.path)}
                >
                  <IconButton>
                    <img
                      src={ArrowForwardIosIcon}
                      alt=""
                      width="14px"
                      height="14px"
                    />
                  </IconButton>
                </Box>
              )}
              {content.key === 'savedItems' && (
                <Box className="saved-items-flex">
                  <IconButton>
                    <img src={delete_icon} alt="" width="20px" height="22px" />
                  </IconButton>
                  <IconButton>
                    <img src={edit_icon} alt="" width="20px" height="22px" />
                  </IconButton>
                </Box>
              )}
            </Box>
          );
        })}
        {content.mainImage && (
          <Box className="main-image">
            <img
              src={content.mainImage}
              alt="main"
              style={{ padding: '20px 0' }}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
}
export default Card;
