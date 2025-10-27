import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
    Paper,
} from '@mui/material';
import {
    Email,
    Phone,
    LocationOn,
    AccessTime,
    Send,
    ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Contact form validation schema
const contactFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Please enter a valid email address'),
    subject: z.string().min(1, 'Please select a subject'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
    const theme = useTheme();
    const navigate = useNavigate();
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
            // Simulate API call - replace with actual API endpoint
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log('Form data:', data);

            setSubmitStatus('success');
            setTimeout(() => reset(), 3000);

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitStatus('idle'), 5000);
        } catch (error) {
            setSubmitStatus('error');
            console.error('Form submission error:', error);
        }
    };

    const contactInfo = [
        { icon: Email, label: 'Email', value: 'support@denizaltun.de' },
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
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Back Button */}
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
            >
                Back
            </Button>

            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography
                    variant="h3"
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

            <Grid container spacing={4}>
                {/* Contact Information */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            height: '100%',
                            backgroundColor: theme.palette.mode === 'light'
                                ? '#ffffff'
                                : 'background.paper',
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
                    </Paper>
                </Grid>

                {/* Contact Form */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            backgroundColor: theme.palette.mode === 'light'
                                ? '#ffffff'
                                : 'background.paper',
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
                                Something went wrong. Please try again later.
                            </Alert>
                        )}
                        <Alert severity="warning" sx={{ mb: 3, }}>
                            <strong>Note:</strong> Our automated email system is currently being set up.
                            In the meantime, you can reach out to us at{' '}
                            <strong>support@denizaltun.de</strong> or{' '}
                            <strong>contact@denizaltun.de</strong> for any inquiries. <br/>
                            We appreciate your patience.
                        </Alert>

                        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <TextField
                                        {...register('name')}
                                        fullWidth
                                        label="Your Name"
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        disabled={isSubmitting}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        {...register('email')}
                                        fullWidth
                                        label="Email Address"
                                        type="email"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        disabled={isSubmitting}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        {...register('subject')}
                                        fullWidth
                                        select
                                        label="Subject"
                                        defaultValue=""
                                        error={!!errors.subject}
                                        helperText={errors.subject?.message}
                                        disabled={isSubmitting}
                                    >
                                        {subjects.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        {...register('message')}
                                        fullWidth
                                        label="Message"
                                        multiline
                                        rows={6}
                                        error={!!errors.message}
                                        helperText={errors.message?.message}
                                        disabled={isSubmitting}
                                    />
                                </Grid>
                            </Grid>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                }}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};