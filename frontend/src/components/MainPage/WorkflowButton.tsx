import type { WorkflowButtonProps, WorkflowType } from "../../validation/actionButtonsSchema.ts";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Calendar from '@mui/icons-material/CalendarToday';
import QueryStats from '@mui/icons-material/QueryStats';
import Schedule from '@mui/icons-material/Schedule';
import Assessment from '@mui/icons-material/Assessment';

export default function WorkflowButton({
    type,
    onClick,
    disabled,
    isActive
}: WorkflowButtonProps) {

    const getButtonConfig = (buttonType: WorkflowType) => {
        switch (buttonType) {
            case 'workflow':
                return {
                    icon: <Calendar sx={{ fontSize: 20 }} />,
                    label: 'Workflow',
                    description: 'Manage work schedules',
                    color: '#4299e1',
                };
            case 'balance':
                return {
                    icon: <QueryStats sx={{ fontSize: 20 }} />,
                    label: 'Balance',
                    description: 'Check time balance',
                    color: '#38a169',
                };
            case 'schedule':
                return {
                    icon: <Schedule sx={{ fontSize: 20 }} />,
                    label: 'Schedule',
                    description: 'View work schedule',
                    color: '#ed8936',
                };
            case 'reports':
                return {
                    icon: <Assessment sx={{ fontSize: 20 }} />,
                    label: 'Reports',
                    description: 'Time reports',
                    color: '#9f7aea',
                };
            default:
                return {
                    icon: <Calendar sx={{ fontSize: 20 }} />,
                    label: 'Unknown',
                    description: 'Unknown action',
                    color: '#718096',
                };
        }
    };

    const config = getButtonConfig(type);


    return (
        <Box
            onClick={disabled ? undefined : onClick}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px 12px',
                border: '2px solid',
                borderColor: isActive ? config.color : disabled ? '#e2e8f0' : '#cbd5e0',
                borderRadius: '12px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                backgroundColor: isActive ? `${config.color}15` : disabled ? '#f7fafc' : 'white',
                color: disabled ? '#a0aec0' : '#2d3748',
                transition: 'all 0.3s ease',
                minWidth: '120px',
                opacity: disabled ? 0.6 : 1,
                '&:hover': disabled ? {} : {
                    borderColor: config.color,
                    backgroundColor: `${config.color}10`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${config.color}20`,
                },
            }}
        >
            {/* Icon Container */}
            <Box
                sx={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: isActive ? config.color : disabled ? '#e2e8f0' : `${config.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? 'white' : disabled ? '#a0aec0' : config.color,
                    marginBottom: '12px',
                    transition: 'all 0.3s ease',
                }}
            >
                {config.icon}
            </Box>

            {/* Label */}
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    marginBottom: '4px',
                    color: disabled ? '#a0aec0' : '#2d3748',
                }}
            >
                {config.label}
            </Typography>

            {/* Description */}
            <Typography
                variant="caption"
                sx={{
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    color: disabled ? '#cbd5e0' : '#718096',
                    lineHeight: 1.2,
                }}
            >
                {config.description}
            </Typography>

            {/* Active Indicator */}
            {isActive && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: config.color,
                    }}
                />
            )}
        </Box>
 );
};
