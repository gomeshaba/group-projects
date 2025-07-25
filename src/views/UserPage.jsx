import React, { useState } from "react";
import { AlertCircle, CheckCircle, Clock, User, GraduationCap, MapPin, Phone, Mail, FileText, Shield, TrendingUp, Users, Award, ChevronRight, ChevronDown, Info, X, Menu } from "lucide-react";

// Enhanced country and city data
const countryOptions = [
  "Malawi", "Kenya", "Tanzania", "Zambia", "Zimbabwe", "South Africa", "Nigeria", "Uganda", "Botswana"
];

const cityOptions = {
  Malawi: ["Lilongwe", "Blantyre", "Mzuzu", "Zomba", "Kasungu", "Karonga", "Mangochi", "Salima"],
  Kenya: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
  Tanzania: ["Dar es Salaam", "Dodoma", "Arusha", "Mwanza"],
  Zambia: ["Lusaka", "Kitwe", "Ndola", "Livingstone"],
  Zimbabwe: ["Harare", "Bulawayo", "Mutare", "Gweru"],
  "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria"],
  Nigeria: ["Lagos", "Abuja", "Kano", "Ibadan"],
  Uganda: ["Kampala", "Entebbe", "Gulu", "Mbarara"],
  Botswana: ["Gaborone", "Francistown", "Maun", "Kasane"]
};

const institutions = [
  "University of Malawi",
  "Mzuzu University", 
  "Lilongwe University of Agriculture and Natural Resources",
  "Malawi University of Science and Technology",
  "Catholic University of Malawi",
  "Skyway University",
  "Adventist University of Africa",
  "Other"
];

const fieldsOfStudy = [
  "Medicine", "Engineering", "Computer Science", "Business Administration", 
  "Law", "Education", "Agriculture", "Nursing", "Economics", "Arts", "Other"
];

const initialState = {
  // Personal Information
  firstName: "",
  lastName: "",
  age: "",
  gender: "",
  maritalStatus: "",
  nationalId: "",
  
  // Location & Eligibility
  country: "",
  city: "",
  areaType: "",
  bornMalawian: "",
  basedInMalawi: "",
  malawianBasedNotMalawian: "",
  malawianBornNotBased: "",
  
  // Education & Employment
  education: "",
  employmentStatus: "",
  institution: "",
  customInstitution: "",
  fieldOfStudy: "",
  customField: "",
  graduationYear: "",
  studentId: "",
  
  // Financial Information
  income: "",
  dependents: 0,
  dependentsAges: [],
  
  // Payment History
  rentHistory: "",
  utilityHistory: "",
  mobileHistory: "",
  
  // Special Circumstances
  disability: "",
  orphanStatus: "",
  
  // Contact Information
  email: "",
  phone: "",
  alternatePhone: "",
  
  // Guarantor Information
  guarantorName: "",
  guarantorRelationship: "",
  guarantorContact: "",
  guarantorEmail: "",
  
  // Documents
  studentDocument: null,
  
  // Loan Details
  loanAmount: "",
  loanPurpose: "",
  
  // Agreement
  agreed: false,
  privacyAgreed: false
};

const StudentLoanApp = () => {
  const [form, setForm] = useState(initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const steps = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Education", icon: GraduationCap },
    { id: 3, title: "Financial", icon: TrendingUp },
    { id: 4, title: "References", icon: Users },
    { id: 5, title: "Review", icon: CheckCircle }
  ];

  // Form validation
  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1:
        if (!form.firstName.trim()) newErrors.firstName = "First name is required";
        if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!form.age || form.age < 16) newErrors.age = "Age must be at least 16";
        if (!form.gender) newErrors.gender = "Gender is required";
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Valid email required";
        if (!form.phone.match(/^\+?\d{9,}$/)) newErrors.phone = "Valid phone number required";
        if (!form.country) newErrors.country = "Country is required";
        if (!form.city) newErrors.city = "City is required";
        break;
      case 2:
        if (!form.education) newErrors.education = "Education level is required";
        if (!form.employmentStatus) newErrors.employmentStatus = "Employment status is required";
        if (form.employmentStatus === "student") {
          if (!form.institution) newErrors.institution = "Institution is required";
          if (form.institution === "Other" && !form.customInstitution.trim()) {
            newErrors.customInstitution = "Please specify institution";
          }
          if (!form.fieldOfStudy) newErrors.fieldOfStudy = "Field of study is required";
          if (!form.graduationYear) newErrors.graduationYear = "Graduation year is required";
        }
        break;
      case 3:
        if (!form.loanAmount || form.loanAmount < 10000) newErrors.loanAmount = "Minimum loan amount is MWK 10,000";
        if (!form.loanPurpose.trim()) newErrors.loanPurpose = "Loan purpose is required";
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === "dependents") {
      const dependentsNum = Math.max(Number(value), 0);
      setForm(prev => ({
        ...prev,
        dependents: dependentsNum,
        dependentsAges: Array(dependentsNum).fill("")
      }));
    } else if (name.startsWith("dependentAge")) {
      const idx = Number(name.replace("dependentAge", ""));
      const ages = [...form.dependentsAges];
      ages[idx] = value;
      setForm(prev => ({ ...prev, dependentsAges: ages }));
    } else if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Navigation functions
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Eligibility check
  const isEligible = 
    form.country === "Malawi" ||
    (form.bornMalawian === "yes" && countryOptions.includes(form.country)) ||
    (form.basedInMalawi === "yes" && form.country !== "Malawi") ||
    form.malawianBasedNotMalawian === "yes" ||
    form.malawianBornNotBased === "yes";

  // Enhanced city dropdown
  const getCityDropdown = () => {
    if (form.country && cityOptions[form.country]) {
      return (
        <select
          name="city"
          value={form.city}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
            errors.city ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Select City</option>
          {cityOptions[form.country].map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      );
    }
    return (
      <input
        type="text"
        name="city"
        value={form.city}
        onChange={handleChange}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
          errors.city ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="Enter city"
        required
      />
    );
  };

  // Mock assessment logic
  const generateMockAssessment = (data) => {
    let score = 50;
    let reasons = [];

    // Education factors
    if (data.education.employmentStatus === "student") {
      score += 20;
      reasons.push("Active student status");
    }
    
    // High-demand fields
    const highDemandFields = ["Medicine", "Engineering", "Computer Science"];
    if (highDemandFields.includes(data.education.fieldOfStudy)) {
      score += 15;
      reasons.push("High-demand field of study");
    }

    // Payment history
    const avgPaymentHistory = (
      parseInt(data.paymentHistory.rent || 0) +
      parseInt(data.paymentHistory.utilities || 0) +
      parseInt(data.paymentHistory.mobile || 0)
    ) / 3;
    
    if (avgPaymentHistory > 12) {
      score += 15;
      reasons.push("Excellent payment history");
    } else if (avgPaymentHistory > 6) {
      score += 10;
      reasons.push("Good payment history");
    }

    // Guarantor
    if (data.hasGuarantor) {
      score += 10;
      reasons.push("Has guarantor");
    }

    // Risk factors
    if (data.financial.dependents > 3) {
      score -= 10;
      reasons.push("High number of dependents");
    }

    if (data.specialCircumstances.orphanStatus !== "none" && data.specialCircumstances.orphanStatus) {
      score += 5; // Slight boost for social inclusion
      reasons.push("Social inclusion consideration");
    }

    const finalScore = Math.max(0, Math.min(100, score));
    const risk = 100 - finalScore;
    
    return {
      status: finalScore >= 60 ? "accepted" : "rejected",
      risk: `${risk}%`,
      score: `${finalScore}%`,
      reason: reasons.join(", ") || "Standard assessment criteria applied",
      loanAmount: data.financial.loanAmount,
      estimatedRate: finalScore >= 80 ? "8.5%" : finalScore >= 60 ? "12%" : "N/A"
    };
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4) || !form.agreed || !form.privacyAgreed) return;
    
    setLoading(true);
    
    if (!isEligible) {
      setResult({
        status: "rejected",
        risk: 100,
        reason: "Eligibility criteria not met. Only applicants from Malawi or with Malawian connections are eligible."
      });
      setLoading(false);
      return;
    }

    try {
      // Enhanced prompt for AI assessment
      const assessmentData = {
        personalInfo: {
          age: form.age,
          gender: form.gender,
          maritalStatus: form.maritalStatus,
          location: `${form.city}, ${form.country}`,
          areaType: form.areaType
        },
        education: {
          level: form.education,
          institution: form.institution === "Other" ? form.customInstitution : form.institution,
          fieldOfStudy: form.fieldOfStudy === "Other" ? form.customField : form.fieldOfStudy,
          graduationYear: form.graduationYear,
          employmentStatus: form.employmentStatus
        },
        financial: {
          income: form.income,
          dependents: form.dependents,
          loanAmount: form.loanAmount,
          loanPurpose: form.loanPurpose
        },
        paymentHistory: {
          rent: form.rentHistory,
          utilities: form.utilityHistory,
          mobile: form.mobileHistory
        },
        specialCircumstances: {
          disability: form.disability,
          orphanStatus: form.orphanStatus
        },
        hasGuarantor: !!(form.guarantorName && form.guarantorContact)
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock response based on assessment logic
      const mockAssessment = generateMockAssessment(assessmentData);
      setResult(mockAssessment);
      
    } catch (error) {
      setResult({
        status: "error",
        reason: "Unable to process application. Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  // Step components
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input
                  type="number"
                  name="age"
                  min="16"
                  max="65"
                  value={form.age}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    errors.age ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your age"
                />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    errors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                <select
                  name="maritalStatus"
                  value={form.maritalStatus}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                <input
                  type="text"
                  name="nationalId"
                  value={form.nationalId}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Enter your National ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    errors.country ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Country</option>
                  {countryOptions.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                {getCityDropdown()}
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area Type</label>
                <select
                  name="areaType"
                  value={form.areaType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="">Select Area Type</option>
                  <option value="urban">Urban</option>
                  <option value="rural">Rural</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+265 xxx xxx xxx"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={form.alternatePhone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="+265 xxx xxx xxx"
                />
              </div>
            </div>

            {/* Eligibility Questions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">Eligibility Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Were you born in Malawi?</label>
                  <select
                    name="bornMalawian"
                    value={form.bornMalawian}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Are you currently based in Malawi?</label>
                  <select
                    name="basedInMalawi"
                    value={form.basedInMalawi}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Education & Employment</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education Level *</label>
                <select
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    errors.education ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Education Level</option>
                  <option value="secondary">Secondary</option>
                  <option value="tertiary">Tertiary</option>
                  <option value="postgraduate">Postgraduate</option>
                </select>
                {errors.education && <p className="text-red-500 text-xs mt-1">{errors.education}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status *</label>
                <select
                  name="employmentStatus"
                  value={form.employmentStatus}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    errors.employmentStatus ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Status</option>
                  <option value="student">Student</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="part-time">Part-time</option>
                  <option value="full-time">Full-time</option>
                  <option value="self-employed">Self-employed</option>
                </select>
                {errors.employmentStatus && <p className="text-red-500 text-xs mt-1">{errors.employmentStatus}</p>}
              </div>
            </div>

            {form.employmentStatus === "student" && (
              <div className="bg-green-50 p-4 rounded-lg space-y-4">
                <h4 className="font-medium text-green-900 mb-3">
                  <GraduationCap className="inline w-5 h-5 mr-2" />
                  Student Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
                    <select
                      name="institution"
                      value={form.institution}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                        errors.institution ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Institution</option>
                      {institutions.map(inst => (
                        <option key={inst} value={inst}>{inst}</option>
                      ))}
                    </select>
                    {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution}</p>}
                  </div>
                  
                  {form.institution === "Other" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specify Institution *</label>
                      <input
                        type="text"
                        name="customInstitution"
                        value={form.customInstitution}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                          errors.customInstitution ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter institution name"
                      />
                      {errors.customInstitution && <p className="text-red-500 text-xs mt-1">{errors.customInstitution}</p>}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study *</label>
                    <select
                      name="fieldOfStudy"
                      value={form.fieldOfStudy}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                        errors.fieldOfStudy ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Field</option>
                      {fieldsOfStudy.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>
                    {errors.fieldOfStudy && <p className="text-red-500 text-xs mt-1">{errors.fieldOfStudy}</p>}
                  </div>
                  
                  {form.fieldOfStudy === "Other" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specify Field *</label>
                      <input
                        type="text"
                        name="customField"
                        value={form.customField}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Enter field of study"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Graduation Year *</label>
                    <input
                      type="number"
                      name="graduationYear"
                      min={new Date().getFullYear()}
                      max={new Date().getFullYear() + 10}
                      value={form.graduationYear}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                                                errors.graduationYear ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="YYYY"
                    />
                    {errors.graduationYear && <p className="text-red-500 text-xs mt-1">{errors.graduationYear}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <input
                      type="text"
                      name="studentId"
                      value={form.studentId}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="Enter student ID"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Document</label>
                    <div className="flex items-center">
                      <label className="cursor-pointer bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition">
                        <FileText className="w-5 h-5 mr-2 inline" />
                        Upload Document
                        <input
                          type="file"
                          name="studentDocument"
                          onChange={handleChange}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                      {form.studentDocument && (
                        <span className="ml-2 text-sm text-gray-600">{form.studentDocument.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Financial Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (MWK)</label>
                <input
                  type="number"
                  name="income"
                  value={form.income}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Enter amount"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Dependents</label>
                <input
                  type="number"
                  name="dependents"
                  value={form.dependents}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {form.dependents > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-3">Dependents Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from({ length: form.dependents }).map((_, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dependent {index + 1} Age
                      </label>
                      <input
                        type="number"
                        name={`dependentAge${index}`}
                        value={form.dependentsAges[index] || ''}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Age"
                        min="0"
                        max="120"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">Payment History</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rent Payment History (months)</label>
                  <input
                    type="number"
                    name="rentHistory"
                    value={form.rentHistory}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Utility Payment History (months)</label>
                  <input
                    type="number"
                    name="utilityHistory"
                    value={form.utilityHistory}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Payment History (months)</label>
                  <input
                    type="number"
                    name="mobileHistory"
                    value={form.mobileHistory}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-3">Loan Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (MWK) *</label>
                  <input
                    type="number"
                    name="loanAmount"
                    value={form.loanAmount}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                      errors.loanAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Minimum 10,000"
                    min="10000"
                  />
                  {errors.loanAmount && <p className="text-red-500 text-xs mt-1">{errors.loanAmount}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loan Purpose *</label>
                  <input
                    type="text"
                    name="loanPurpose"
                    value={form.loanPurpose}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                      errors.loanPurpose ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tuition, Books, etc."
                  />
                  {errors.loanPurpose && <p className="text-red-500 text-xs mt-1">{errors.loanPurpose}</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">References & Special Circumstances</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">Guarantor Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guarantor Name</label>
                  <input
                    type="text"
                    name="guarantorName"
                    value={form.guarantorName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="Full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <input
                    type="text"
                    name="guarantorRelationship"
                    value={form.guarantorRelationship}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="Relationship to guarantor"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    name="guarantorContact"
                    value={form.guarantorContact}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="+265 xxx xxx xxx"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="guarantorEmail"
                    value={form.guarantorEmail}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="guarantor@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-3">Special Circumstances</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Do you have any disability?</label>
                  <select
                    name="disability"
                    value={form.disability}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  >
                    <option value="">Select</option>
                    <option value="none">No disability</option>
                    <option value="physical">Physical disability</option>
                    <option value="visual">Visual impairment</option>
                    <option value="hearing">Hearing impairment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orphan Status</label>
                  <select
                    name="orphanStatus"
                    value={form.orphanStatus}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  >
                    <option value="">Select</option>
                    <option value="none">Not an orphan</option>
                    <option value="single">Single orphan</option>
                    <option value="double">Double orphan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-3">Agreements</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreed"
                      name="agreed"
                      type="checkbox"
                      checked={form.agreed}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreed" className="font-medium text-gray-700">
                      I certify that all information provided is accurate and complete *
                    </label>
                    {errors.agreed && <p className="text-red-500 text-xs mt-1">{errors.agreed}</p>}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="privacyAgreed"
                      name="privacyAgreed"
                      type="checkbox"
                      checked={form.privacyAgreed}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="privacyAgreed" className="font-medium text-gray-700">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => setShowPrivacyModal(true)}
                        className="text-blue-600 hover:text-blue-800 focus:outline-none"
                      >
                        Privacy Policy
                      </button>{' '}
                      and terms of service *
                    </label>
                    {errors.privacyAgreed && <p className="text-red-500 text-xs mt-1">{errors.privacyAgreed}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Review Your Application</h3>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{form.firstName} {form.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">{form.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{form.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{form.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{form.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{form.city}, {form.country}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Education Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Education Level</p>
                    <p className="font-medium">{form.education}</p>
                  </div>
                  {form.employmentStatus === "student" && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Institution</p>
                        <p className="font-medium">
                          {form.institution === "Other" ? form.customInstitution : form.institution}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Field of Study</p>
                        <p className="font-medium">
                          {form.fieldOfStudy === "Other" ? form.customField : form.fieldOfStudy}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Graduation Year</p>
                        <p className="font-medium">{form.graduationYear}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-200 p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Loan Amount</p>
                    <p className="font-medium">{form.loanAmount} MWK</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loan Purpose</p>
                    <p className="font-medium">{form.loanPurpose}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monthly Income</p>
                    <p className="font-medium">{form.income || 'Not provided'} MWK</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dependents</p>
                    <p className="font-medium">{form.dependents}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex">
                <Info className="flex-shrink-0 h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      By submitting this application, you agree to our terms and conditions. 
                      Please review all information carefully before submitting as changes 
                      cannot be made after submission.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Privacy Policy Modal
  const PrivacyModal = () => (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowPrivacyModal(false)}></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Privacy Policy</h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setShowPrivacyModal(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mt-4 max-h-96 overflow-y-auto pr-2">
                  <div className="text-sm text-gray-500 space-y-4">
                    <p>
                      <strong>1. Information We Collect</strong><br />
                      We collect personal information you provide when applying for a student loan, 
                      including name, contact details, education information, financial details, 
                      and other relevant data.
                    </p>
                    
                    <p>
                      <strong>2. How We Use Your Information</strong><br />
                      Your information is used to process your loan application, assess eligibility, 
                      provide customer service, and comply with legal requirements. We may also use 
                      anonymized data for statistical analysis.
                    </p>
                    
                    <p>
                      <strong>3. Data Sharing</strong><br />
                      We may share your information with credit bureaus, financial institutions, 
                      and regulatory authorities as required by law or necessary for loan processing. 
                      We do not sell your personal information to third parties.
                    </p>
                    
                    <p>
                      <strong>4. Data Security</strong><br />
                      We implement appropriate security measures to protect your personal information 
                      from unauthorized access, alteration, or disclosure.
                    </p>
                    
                    <p>
                      <strong>5. Your Rights</strong><br />
                      You have the right to access, correct, or delete your personal information, 
                      subject to legal limitations. Contact us to exercise these rights.
                    </p>
                    
                    <p>
                      <strong>6. Changes to This Policy</strong><br />
                      We may update this policy periodically. The latest version will always be 
                      available on our website.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setShowPrivacyModal(false)}
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Result display
  const renderResult = () => {
    if (!result) return null;
    
    const isAccepted = result.status === "accepted";
    
    return (
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className={`flex items-center justify-center h-16 w-16 mx-auto rounded-full ${isAccepted ? 'bg-green-100' : 'bg-red-100'}`}>
          {isAccepted ? (
            <CheckCircle className="h-8 w-8 text-green-600" />
          ) : (
            <AlertCircle className="h-8 w-8 text-red-600" />
          )}
        </div>
        
        <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
          {isAccepted ? "Application Approved!" : "Application Not Approved"}
        </h2>
        
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Risk Assessment</p>
              <p className="font-medium">{result.risk}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Approval Score</p>
              <p className="font-medium">{result.score}</p>
            </div>
            {isAccepted && (
              <div>
                <p className="text-sm font-medium text-gray-500">Estimated Interest Rate</p>
                <p className="font-medium">{result.estimatedRate}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Decision Details</h3>
          <p className="mt-2 text-gray-600">{result.reason}</p>
          
          {isAccepted ? (
            <div className="mt-6 bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900">Next Steps</h4>
              <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-green-800">
                <li>You will receive an email with loan documents within 24 hours</li>
                <li>Review and sign the documents electronically</li>
                <li>Funds will be disbursed within 3-5 business days after document signing</li>
              </ol>
            </div>
          ) : (
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900">Alternative Options</h4>
              <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-blue-800">
                <li>Consider applying with a qualified guarantor</li>
                <li>Explore scholarship opportunities at your institution</li>
                <li>Reapply after improving your financial situation</li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              setResult(null);
              setCurrentStep(1);
              setForm(initialState);
            }}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Start New Application
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">Malawi Student Loan</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">FAQs</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Contact</a>
            </div>
            
            <button 
              className="md:hidden text-gray-500 hover:text-gray-900"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          {/* Mobile menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 space-y-2 pb-2">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">About</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">FAQs</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Contact</a>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {result ? (
          renderResult()
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Progress Steps */}
            <div className="px-6 py-4 border-b border-gray-200">
              <nav className="flex items-center justify-center" aria-label="Progress">
                <ol className="flex items-center space-x-8">
                  {steps.map((step) => (
                    <li key={step.id} className="flex items-center">
                      {step.id < currentStep ? (
                        <div className="flex items-center">
                          <span className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </span>
                          <span className="ml-3 text-sm font-medium text-blue-600 hidden sm:block">{step.title}</span>
                        </div>
                      ) : step.id === currentStep ? (
                        <div className="flex items-center" aria-current="step">
                          <span className="flex items-center justify-center w-10 h-10 border-2 border-blue-600 rounded-full">
                            <span className="text-blue-600">{step.id}</span>
                          </span>
                          <span className="ml-3 text-sm font-medium text-blue-600 hidden sm:block">{step.title}</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="flex items-center justify-center w-10 h-10 border-2 border-gray-300 rounded-full">
                            <span className="text-gray-500">{step.id}</span>
                          </span>
                          <span className="ml-3 text-sm font-medium text-gray-500 hidden sm:block">{step.title}</span>
                        </div>
                      )}
                      
                      {step.id < steps.length && (
                        <ChevronRight className="hidden sm:block h-5 w-5 text-gray-400 mx-2" />
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
            
            {/* Form Content */}
            <div className="px-6 py-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {renderStepContent()}
                
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Previous
                    </button>
                  ) : (
                    <div></div>
                  )}
                  
                  {currentStep < steps.length ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : "Submit Application"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      
      {showPrivacyModal && <PrivacyModal />}
    </div>
  );
};

export default StudentLoanApp;
                        