
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  
  // Account Information (PAN details)
  panNumber: string;
  uploadedImage: File | null;
  dob: Date | undefined;
  aadharNumber: string;
  
  // Passport Information (Account details)
  email: string;
  password: string;
  confirmPassword: string;
}

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    panNumber: '',
    uploadedImage: null,
    dob: undefined,
    aadharNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const steps = [
    { number: 1, title: 'Personal Information', key: 'personal' },
    { number: 2, title: 'Account Information', key: 'account' },
    { number: 3, title: 'Passport Information', key: 'passport' }
  ];

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    const { firstName, lastName, phone, gender } = formData;
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !gender) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const { panNumber, aadharNumber, dob } = formData;
    
    // PAN validation (AAAAA1111A format)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panNumber || !panRegex.test(panNumber)) {
      toast({
        title: "Invalid PAN Number",
        description: "PAN should be in format: AAAAA1111A",
        variant: "destructive"
      });
      return false;
    }

    // Aadhaar validation (12 digits)
    const aadharRegex = /^\d{12}$/;
    if (!aadharNumber || !aadharRegex.test(aadharNumber)) {
      toast({
        title: "Invalid Aadhaar Number",
        description: "Aadhaar should be exactly 12 digits",
        variant: "destructive"
      });
      return false;
    }

    if (!dob) {
      toast({
        title: "Date Required",
        description: "Please select your date of birth",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    const { email, password, confirmPassword } = formData;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    if (!password || password.length < 8) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
    }

    if (isValid) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        toast({
          title: "Form Submitted!",
          description: "Your account has been created successfully.",
        });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateFormData('uploadedImage', file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-800">Personal Information</CardTitle>
          <p className="text-sm text-gray-600">Fill out the form to create your account.</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b">
            {steps.map((step) => (
              <button
                key={step.number}
                className={cn(
                  "flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors",
                  currentStep === step.number
                    ? "border-teal-500 text-teal-600 bg-teal-50"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
                onClick={() => {
                  // Allow navigation to previous steps only
                  if (step.number < currentStep) {
                    setCurrentStep(step.number);
                  }
                }}
              >
                {step.title}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="space-y-4">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="panNumber">PAN Card Number</Label>
                  <Input
                    id="panNumber"
                    placeholder="AAAAA1111A"
                    value={formData.panNumber}
                    onChange={(e) => updateFormData('panNumber', e.target.value.toUpperCase())}
                    maxLength={10}
                  />
                </div>
                
                <div>
                  <Label htmlFor="imageUpload">Upload Image</Label>
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                </div>
                
                <div>
                  <Label>Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dob && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dob ? format(formData.dob, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.dob}
                        onSelect={(date) => updateFormData('dob', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label htmlFor="aadharNumber">Aadhaar Number (12 digits)</Label>
                  <Input
                    id="aadharNumber"
                    placeholder="123456789012"
                    value={formData.aadharNumber}
                    onChange={(e) => updateFormData('aadharNumber', e.target.value.replace(/\D/g, ''))}
                    maxLength={12}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="px-6 bg-gray-800 hover:bg-gray-900 text-white"
            >
              {currentStep === 3 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiStepForm;
