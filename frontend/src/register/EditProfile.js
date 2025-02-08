import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, FormGroup, FormLabel, FormControl, InputGroup, ProgressBar } from 'react-bootstrap';
import { getAuthToken, getLogin } from 'src/services/BackendService';
import MessageToast from 'src/MessageToast/MessageToast';

function EditProfileForm() {
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorShow, setErrorShow] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordFeedback, setPasswordFeedback] = useState('');
    const [passwordValidity, setPasswordValidity] = useState('');
    const [formData, setFormData] = useState({
        login: getLogin(getAuthToken()),
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8080/get-user/${getLogin(getAuthToken())}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.ok ? response.json() : Promise.reject("User not found"))
          .then(data => {
              setFormData(prevFormData => ({
                  ...prevFormData,
                  firstName: data.firstName,
                  lastName: data.lastName
              }));
          })
          .catch(error => console.error("User fetch error", error))
          .finally(() => setLoading(false));
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "password") {
            evaluatePassword(value);
        }
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const evaluatePassword = (password) => {
        const feedback = [];
        let strength = 0;

        if (password.length >= 8 && password.length <= 20) {
            strength += 25;
            feedback.push("Good length");
        } else {
            feedback.push("Password must be 8-20 characters long");
        }

        if (/[A-Z]/.test(password)) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 15;
        if (/[()$@$$!%*#?&]/.test(password)) strength += 10;

        setPasswordStrength(strength);
        setPasswordFeedback(feedback.join(', '));
        setPasswordValidity(strength < 60 ? "Password is too weak: " + feedback.join(', ') : "");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwordValidity) {
            setErrorShow(true);
            setErrorMessage(passwordValidity);
            return;
        }
        fetch("http://localhost:8080/edit-profile", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error("Profile update failed");
        })
        .then(() => window.location.href = "/edit-profile-confirmation")
        .catch(error => {
            setErrorShow(true);
            setErrorMessage(error.message);
        });
    };

    if (loading) return <h1>Loading...</h1>;

    return (
        <Container className="mt-5" style={{ paddingBottom: '70px' }}>
            <MessageToast show={errorShow} title={"Could not update"} message={errorMessage} onClose={() => setErrorShow(false)} bg={"danger"} />
            <Row className="justify-content-center">
                <Col xs={12} md={6}>
                    <h2 className="text-center mb-4">Edit Profile</h2>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup className="mb-3">
                            <FormLabel>First Name</FormLabel>
                            <FormControl type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <FormLabel>Last Name</FormLabel>
                            <FormControl type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <FormLabel>New Password</FormLabel>
                            <InputGroup>
                                <FormControl type={showPassword ? "text" : "password"} placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
                                <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                    {showPassword ? '🔓' : '🔒'}
                                </InputGroup.Text>
                            </InputGroup>
                            <ProgressBar now={passwordStrength} variant={passwordStrength > 50 ? 'success' : 'warning'} />
                            <small className="form-text text-muted">Password Feedback: {passwordFeedback}</small>
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup>
                                <FormControl type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                                <InputGroup.Text onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }}>
                                    {showConfirmPassword ? '🔓' : '🔒'}
                                </InputGroup.Text>
                            </InputGroup>
                        </FormGroup>
                        <Button variant="success" type="submit" className="w-100">Save</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default EditProfileForm;
