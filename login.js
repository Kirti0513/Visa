// TeyZee Visas - Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Handle login form submission
    const loginForm = document.querySelector('.login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const mobileInput = this.querySelector('input[type="tel"]');
            if (!mobileInput || !mobileInput.value.trim()) {
                showFormError(mobileInput, 'Please enter your mobile number');
                return;
            }
            
            // Mobile number validation
            const mobileNumber = mobileInput.value.trim();
            if (!/^\d{10}$/.test(mobileNumber)) {
                showFormError(mobileInput, 'Please enter a valid 10-digit mobile number');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending OTP...';
            
            // Simulate API call to send OTP
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                // In a real application, this would come from a server response
                const success = true;
                
                if (success) {
                    // Show OTP input section
                    showOTPInput(mobileNumber);
                } else {
                    showFormError(mobileInput, 'Failed to send OTP. Please try again.');
                }
            }, 1500);
        });
    }
    
    // Handle testimonial pagination
    initTestimonialPagination();
});

// Show form error message
function showFormError(inputElement, message) {
    // Remove any existing error messages
    const existingError = inputElement.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Add error styling to input
    inputElement.style.borderColor = 'var(--error-red)';
    
    // Insert error message after input wrapper
    inputElement.parentElement.appendChild(errorElement);
    
    // Remove error on input focus
    inputElement.addEventListener('focus', function() {
        this.style.borderColor = 'var(--primary-blue)';
        const error = this.parentElement.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }, { once: true });
}

// Show OTP input section
function showOTPInput(mobileNumber) {
    const loginForm = document.querySelector('.login-form');
    const loginArea = document.querySelector('.login-area');
    
    // Create OTP form
    const otpForm = document.createElement('form');
    otpForm.className = 'otp-form';
    
    otpForm.innerHTML = `
        <div class="login-header">
            <img src="/api/placeholder/60/60" alt="TeyZee Visas icon">
            <h2>Enter OTP</h2>
            <p>We've sent a verification code to +91 ${mobileNumber}</p>
        </div>
        
        <div class="form-group">
            <div class="otp-input-group">
                <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required>
                <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required>
                <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required>
                <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required>
            </div>
            <div class="resend-container">
                <span class="timer">Resend in 30s</span>
                <button type="button" class="resend-btn" disabled>Resend OTP</button>
            </div>
        </div>
        
        <button type="submit" class="btn-primary">Verify & Continue</button>
        
        <p class="terms">
            By continuing, you agree to our <a href="#">terms & conditions</a>
        </p>
    `;
    
    // Replace login form with OTP form
    loginArea.removeChild(loginForm);
    loginArea.appendChild(otpForm);
    
    // Focus first OTP input
    const firstInput = otpForm.querySelector('input');
    if (firstInput) {
        firstInput.focus();
    }
    
    // Add event listeners for OTP inputs
    const otpInputs = otpForm.querySelectorAll('input');
    otpInputs.forEach((input, index) => {
        // Auto focus next input
        input.addEventListener('input', function() {
            if (this.value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        
        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
    
    // Start timer for resend button
    let seconds = 30;
    const timerElement = otpForm.querySelector('.timer');
    const resendButton = otpForm.querySelector('.resend-btn');
    
    let interval = setInterval(() => {
        seconds--;
        timerElement.textContent = `Resend in ${seconds}s`;
        
        if (seconds <= 0) {
            clearInterval(interval);
            timerElement.textContent = '';
            resendButton.disabled = false;
        }
    }, 1000);
    
    // Handle resend button click
    resendButton.addEventListener('click', function() {
        this.disabled = true;
        seconds = 30;
        timerElement.textContent = `Resend in ${seconds}s`;
        
        interval = setInterval(() => {
            seconds--;
            timerElement.textContent = `Resend in ${seconds}s`;
            
            if (seconds <= 0) {
                clearInterval(interval);
                timerElement.textContent = '';
                resendButton.disabled = false;
            }
        }, 1000);
        
        // Show notification that OTP has been resent
        showNotification('OTP has been resent to your mobile number', 'success');
    });
    
    // Handle OTP form submission
    otpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let otpValue = '';
        otpInputs.forEach(input => {
            otpValue += input.value;
        });
        
        if (otpValue.length !== 4) {
            // Show error
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = 'Please enter a valid 4-digit OTP';
            errorElement.style.textAlign = 'center';
            
            // Remove existing error if any
            const existingError = otpForm.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            otpForm.querySelector('.otp-input-group').after(errorElement);
            return;
        }
        
        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Verifying...';
        
        // Simulate API call to verify OTP
        setTimeout(() => {
            // In a real application, this would come from a server response
            const success = true;
            
            if (success) {
                // Redirect to dashboard/home
                window.location.href = 'index.html';
            } else {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                // Show error
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = 'Invalid OTP. Please try again.';
                errorElement.style.textAlign = 'center';
                
                // Remove existing error if any
                const existingError = otpForm.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                
                otpForm.querySelector('.otp-input-group').after(errorElement);
            }
        }, 1500);
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification container if not exists
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add icon based on type
    const icon = document.createElement('i');
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
        icon.style.color = 'var(--success-green)';
    } else {
        icon.className = 'fas fa-exclamation-circle';
        icon.style.color = 'var(--error-red)';
    }
    
    notification.prepend(icon);
    notificationContainer.appendChild(notification);
    
    // Remove notification after delay
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize testimonial pagination
function initTestimonialPagination() {
    const dots = document.querySelectorAll('.pagination .dot');
    const testimonialCard = document.querySelector('.testimonial-card');
    
    if (dots.length > 0 && testimonialCard) {
        // Sample testimonials data
        const testimonials = [
            {
                location: "VALLEY OF KINGS IN LUXOR, EGYPT",
                content: "TeyZee Visas made my visa process stress-free! Prompt service, clear upfront pricing, and smooth approvals for my trips to Indonesia, Vietnam, and Egypt.",
                author: "Shrinath V",
                title: "Founder: The Salient Product"
            },
            {
                location: "CHAMPS-ÉLYSÉES IN PARIS, FRANCE",
                content: "Using TeyZee Visas for my France visa was incredibly smooth. The team guided me through every step and I got my visa in just 8 days!",
                author: "Rahul M",
                title: "Software Engineer"
            },
            {
                location: "TOKYO TOWER IN JAPAN",
                content: "The detailed document checklist and responsive customer service made getting my Japan visa much easier than expected.",
                author: "Priya K",
                title: "Marketing Professional"
            },
            {
                location: "MARINA BAY IN SINGAPORE",
                content: "My Singapore visa was processed in just 3 days! The team was responsive and the online portal made document submission easy.",
                author: "Amit S",
                title: "Business Consultant"
            }
        ];
        
        // Auto-rotate testimonials
        let currentIndex = 0;
        const autoRotateInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateTestimonial(currentIndex);
            updateActiveDot(currentIndex);
        }, 5000);
        
        // Set up click handlers for pagination dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                // Clear auto-rotate interval when user interacts
                clearInterval(autoRotateInterval);
                
                // Update testimonial and dot
                updateTestimonial(index);
                updateActiveDot(index);
                
                // Restart auto-rotate
                currentIndex = index;
                setTimeout(() => {
                    autoRotateInterval = setInterval(() => {
                        currentIndex = (currentIndex + 1) % testimonials.length;
                        updateTestimonial(currentIndex);
                        updateActiveDot(currentIndex);
                    }, 5000);
                }, 10000);
            });
        });
        
        // Update testimonial content
        function updateTestimonial(index) {
            testimonialCard.style.opacity = '0';
            
            setTimeout(() => {
                const testimonial = testimonials[index];
                testimonialCard.querySelector('.testimonial-tag').textContent = testimonial.location;
                testimonialCard.querySelector('.testimonial-content').textContent = testimonial.content;
                testimonialCard.querySelector('.author-info h4').textContent = testimonial.author;
                testimonialCard.querySelector('.author-info p').textContent = testimonial.title;
                
                testimonialCard.style.opacity = '1';
            }, 300);
        }
        
        // Update active dot
        function updateActiveDot(index) {
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');
        }
    }
}