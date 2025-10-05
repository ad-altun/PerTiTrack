import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Container,
    Grid,
    Typography,
    TextField,
    Button,
    MenuItem,
    useTheme,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Email, Phone, LocationOn, AccessTime, Send } from '@mui/icons-material';
import { contactFormSchema, type ContactFormData } from '../validation/landingPageSchemas.ts';

export default function ContactSection() {
    const theme = useTheme();
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log('Form data:', data);

            setSubmitStatus('success');
            reset();

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitStatus('idle'), 5000);
        } catch (error) {
            setSubmitStatus('error');
            console.error('Form submission error:', error);
        }
    };

    const contactInfo = [
        { icon: Email, label: 'Email', value: 'support@pertitrack.com' },
        { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
        { icon: LocationOn, label: 'Address', value: '123 Business Ave, Tech City, TC 12345' },
        { icon: AccessTime, label: 'Hours', value: 'Monday - Friday, 9:00 AM - 6:00 PM' },
    ];

    const subjects = [
        { value: 'general', label: 'General Inquiry' },
        { value: 'support', label: 'Technical Support' },
        { value: 'sales', label: 'Sales & Pricing' },
        { value: 'demo', label: 'Request Demo' },
        { value: 'feedback', label: 'Feedback' },
    ];

    return (
        <Box
            sx={{
                py: { xs: 8, md: 12 },
                backgroundColor: theme.palette.mode === 'light' ? '#f8fafc' : 'background.default',
            }}
        >
            <Container maxWidth="lg">
                {/* Section Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '2rem', md: '2.75rem' },
                            fontWeight: 700,
                            mb: 2,
                            color: 'text.primary',
                        }}
                    >
                        Get In Touch
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: { xs: '1rem', md: '1.125rem' },
                            color: 'text.secondary',
                            maxWidth: 600,
                            mx: 'auto',
                            lineHeight: 1.7,
                        }}
                    >
                        Have questions? We'd love to hear from you. Send us a message and
                        we'll respond as soon as possible.
                    </Typography>
                </Box>

                <Grid container spacing={4} alignItems="stretch">
                    {/* Contact Information */}
                    <Grid sx={{ xs:'12', md:'15',}}>
                        <Box
                            sx={{
                                p: 4,
                                height: '100%',
                                backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : 'background.paper',
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 600,
                                    mb: 3,
                                    color: 'text.primary',
                                }}
                            >
                                Contact Information
                            </Typography>

                            {contactInfo.map((item, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: theme.palette.mode === 'light'
                                                ? 'rgba(37,99,235,0.1)'
                                                : 'rgba(59,130,246,0.15)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <item.icon sx={{ color: 'primary.main', fontSize: 24 }} />
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 600,
                                                color: 'text.secondary',
                                                mb: 0.5,
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'text.primary',
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {item.value}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* Contact Form */}
                    <Grid sx={{ xs:'12', md:'7',}}>
                        <Box
                            sx={{
                                p: 4,
                                backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : 'background.paper',
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 600,
                                    mb: 3,
                                    color: 'text.primary',
                                }}
                            >
                                Send Us a Message
                            </Typography>

                            {/* Success/Error Messages */}
                            {submitStatus === 'success' && (
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                                </Alert>
                            )}
                            {submitStatus === 'error' && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    Oops! Something went wrong. Please try again later.
                                </Alert>
                            )}

                            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                                <Grid container spacing={2.5}>
                                    {/* Name */}
                                    <Grid sx={{ xs:'12'}}>
                                        <TextField
                                            {...register('name')}
                                            fullWidth
                                            label="Full Name"
                                            placeholder="John Doe"
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            disabled={isSubmitting}
                                        />
                                    </Grid>

                                    {/* Email */}
                                    <Grid sx={{ xs:'12', sm:'6',}}>
                                        <TextField
                                            {...register('email')}
                                            fullWidth
                                            label="Email Address"
                                            placeholder="john.doe@company.com"
                                            type="email"
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                            disabled={isSubmitting}
                                        />
                                    </Grid>

                                    {/* Phone */}
                                    <Grid sx={{ xs:'12', sm:'6',}}>
                                        <TextField
                                            {...register('phone')}
                                            fullWidth
                                            label="Phone Number (Optional)"
                                            placeholder="+1 (555) 123-4567"
                                            error={!!errors.phone}
                                            helperText={errors.phone?.message}
                                            disabled={isSubmitting}
                                        />
                                    </Grid>

                                    {/* Subject */}
                                    <Grid sx={{ xs:'12',}}>
                                        <TextField
                                            {...register('subject')}
                                            fullWidth
                                            select
                                            label="Subject"
                                            error={!!errors.subject}
                                            helperText={errors.subject?.message}
                                            disabled={isSubmitting}
                                            defaultValue=""
                                        >
                                            <MenuItem value="" disabled>
                                                Select a subject...
                                            </MenuItem>
                                            {subjects.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>

                                    {/* Message */}
                                    <Grid sx={{ xs:'12',}}>
                                        <TextField
                                            {...register('message')}
                                            fullWidth
                                            multiline
                                            rows={5}
                                            label="Message"
                                            placeholder="Tell us how we can help you..."
                                            error={!!errors.message}
                                            helperText={errors.message?.message}
                                            disabled={isSubmitting}
                                        />
                                    </Grid>

                                    {/* Submit Button */}
                                    <Grid sx={{ xs:'12',}}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            disabled={isSubmitting}
                                            endIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                                            sx={{
                                                py: 1.5,
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                borderRadius: 2,
                                            }}
                                        >
                                            {isSubmitting ? 'Sending...' : 'Send Message'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}