import { Box, Typography } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';

interface WorkflowButtonProps {
    icon: string;
    label: string;
    onClick: () => void;
}

export default function WorkflowButton({
    icon,
    label,
    onClick
}: WorkflowButtonProps) {
 return (
     <Box
         onClick={onClick}
         sx={{
             paddingBlock: 2,
             paddingInline: 6.5,
             textAlign: 'center',
             border: 2,
             borderColor: '#1976d2',
             borderRadius: 2,
             cursor: 'pointer',
             background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
             color: '#1976d2',
             fontWeight: 500,
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             gap: 1,
             minHeight: '4.5rem',
             position: 'relative',
             transition: 'all 0.3s ease',
             '&:hover': {
                 background: 'linear-gradient(135deg, #bbdefb, #90caf9)',
                 borderColor: '#1565c0',
                 transform: 'translateY(-2px)',
                 boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
             },
             '&:active': {
                 transform: 'scale(0.95)',
             },
             '&::after': {
                 content: '"📋"',
                 position: 'absolute',
                 top: 8,
                 right: 8,
                 fontSize: 12,
             }
         }}
     >
         <Box
             sx={{
                 width: 40,
                 height: 40,
                 borderRadius: '50%',
                 bgcolor: '#1976d2',
                 color: 'white',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: 16,
             }}
         >
             {icon}
         </Box>
         <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 12 }}>
             {label}
         </Typography>
     </Box>
 );
};
