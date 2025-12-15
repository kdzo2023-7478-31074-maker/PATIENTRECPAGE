import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  ArrowLeft,
  Users,
  FileText,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Phone,
  MapPin,
  User,
  Heart,
  Pill,
  RefreshCw,
  Filter,
  Search,
  Download,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Building2,
  Info
} from 'lucide-react';
import { supabase, PatientRecord } from '../lib/supabase';
import SkeletonLoader from './SkeletonLoader';
import InfoTooltip from './Tooltip';

interface DashboardProps {
  onBackToHome: () => void;
}

interface DashboardStats {
  totalPatients: number;
  malePatients: number;
  femalePatients: number;
  averageAge: number;
  recentRecords: number;
  commonDiagnoses: { diagnosis: string; count: number }[];
  ageGroups: { group: string; count: number }[];
  monthlyRecords: { month: string; count: number }[];
}

interface PatientDiagnosisSummary {
  diagnosis: string;
  total_patient: number;
  avg_age: number;
}

interface AverageAgeByTreatment {
  treatment_type: string;
  average_age: number;
}

interface AnnualNewPatientGrowth {
  year: number;
  new_patients: number;
}

interface PatientCountsByBirthYear {
  birth_year: number;
  patient_count: number;
}

interface GenderCountsByDiagnosis {
  diagnosis: string;
  male_count: number;
  female_count: number;
  other_count: number;
}

interface TopTreatmentsByUtilization {
  treatment_type: string;
  utilization_count: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onBackToHome }) => {
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    malePatients: 0,
    femalePatients: 0,
    averageAge: 0,
    recentRecords: 0,
    commonDiagnoses: [],
    ageGroups: [],
    monthlyRecords: []
  });
  
  // Report states
  const [diagnosisSummary, setDiagnosisSummary] = useState<PatientDiagnosisSummary[]>([]);
  const [ageByTreatment, setAgeByTreatment] = useState<AverageAgeByTreatment[]>([]);
  const [annualGrowth, setAnnualGrowth] = useState<AnnualNewPatientGrowth[]>([]);
  const [birthYearCounts, setBirthYearCounts] = useState<PatientCountsByBirthYear[]>([]);
  const [genderByDiagnosis, setGenderByDiagnosis] = useState<GenderCountsByDiagnosis[]>([]);
  const [topTreatments, setTopTreatments] = useState<TopTreatmentsByUtilization[]>([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [showAllRecords, setShowAllRecords] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchPatientRecords = async () => {
    try {
      setLoading(true);

      let allRecords: PatientRecord[] = [];
      let from = 0;
      const batchSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from('patientrecords')
          .select('*')
          .order('date_of_record', { ascending: false })
          .range(from, from + batchSize - 1);

        if (error) {
          console.error('Error fetching patient records:', error);
          hasMore = false;
          break;
        }

        if (data) {
          allRecords = [...allRecords, ...data];

          if (data.length < batchSize) {
            hasMore = false;
          } else {
            from += batchSize;
          }
        } else {
          hasMore = false;
        }
      }

      if (allRecords.length > 0) {
        setRecords(allRecords);
        setFilteredRecords(allRecords);
        calculateStats(allRecords);
        calculateReports(allRecords);
        setLastUpdated(new Date());
        console.log(`Loaded ${allRecords.length} patient records`);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: PatientRecord[]) => {
    const totalPatients = data.length;
    const malePatients = data.filter(p => p.gender?.toLowerCase() === 'male').length;
    const femalePatients = data.filter(p => p.gender?.toLowerCase() === 'female').length;
    
    const validAges = data.filter(p => p.age && p.age > 0).map(p => p.age!);
    const averageAge = validAges.length > 0 ? Math.round(validAges.reduce((a, b) => a + b, 0) / validAges.length) : 0;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRecords = data.filter(p => 
      p.date_of_record && new Date(p.date_of_record) >= thirtyDaysAgo
    ).length;

    // Common diagnoses
    const diagnosisCount: { [key: string]: number } = {};
    data.forEach(p => {
      if (p.diagnosis) {
        diagnosisCount[p.diagnosis] = (diagnosisCount[p.diagnosis] || 0) + 1;
      }
    });
    const commonDiagnoses = Object.entries(diagnosisCount)
      .map(([diagnosis, count]) => ({ diagnosis, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Age groups
    const ageGroupCount = {
      '0-18': 0,
      '19-35': 0,
      '36-50': 0,
      '51-65': 0,
      '65+': 0
    };
    
    data.forEach(p => {
      if (p.age) {
        if (p.age <= 18) ageGroupCount['0-18']++;
        else if (p.age <= 35) ageGroupCount['19-35']++;
        else if (p.age <= 50) ageGroupCount['36-50']++;
        else if (p.age <= 65) ageGroupCount['51-65']++;
        else ageGroupCount['65+']++;
      }
    });

    const ageGroups = Object.entries(ageGroupCount)
      .map(([group, count]) => ({ group, count }))
      .filter(item => item.count > 0);

    // Monthly records (last 6 months)
    const monthlyCount: { [key: string]: number } = {};
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      months.push({ key: monthKey, name: monthName });
      monthlyCount[monthKey] = 0;
    }

    data.forEach(p => {
      if (p.date_of_record) {
        const recordMonth = p.date_of_record.slice(0, 7);
        if (monthlyCount.hasOwnProperty(recordMonth)) {
          monthlyCount[recordMonth]++;
        }
      }
    });

    const monthlyRecords = months.map(month => ({
      month: month.name,
      count: monthlyCount[month.key]
    }));

    setStats({
      totalPatients,
      malePatients,
      femalePatients,
      averageAge,
      recentRecords,
      commonDiagnoses,
      ageGroups,
      monthlyRecords
    });
  };

  const calculateReports = (data: PatientRecord[]) => {
    // 1. Patient Diagnosis Summary
    const diagnosisMap: { [key: string]: { count: number; ages: number[] } } = {};
    data.forEach(p => {
      if (p.diagnosis && p.age) {
        if (!diagnosisMap[p.diagnosis]) {
          diagnosisMap[p.diagnosis] = { count: 0, ages: [] };
        }
        diagnosisMap[p.diagnosis].count++;
        diagnosisMap[p.diagnosis].ages.push(p.age);
      }
    });

    const diagnosisSummaryData = Object.entries(diagnosisMap)
      .map(([diagnosis, info]) => ({
        diagnosis,
        total_patient: info.count,
        avg_age: Math.round(info.ages.reduce((a, b) => a + b, 0) / info.ages.length)
      }))
      .sort((a, b) => b.total_patient - a.total_patient);

    setDiagnosisSummary(diagnosisSummaryData);

    // 2. Average Patient Age by Treatment
    const treatmentMap: { [key: string]: number[] } = {};
    data.forEach(p => {
      if (p.treatment && p.age) {
        if (!treatmentMap[p.treatment]) {
          treatmentMap[p.treatment] = [];
        }
        treatmentMap[p.treatment].push(p.age);
      }
    });

    const ageByTreatmentData = Object.entries(treatmentMap)
      .map(([treatment_type, ages]) => ({
        treatment_type,
        average_age: Math.round(ages.reduce((a, b) => a + b, 0) / ages.length)
      }))
      .sort((a, b) => b.average_age - a.average_age);

    setAgeByTreatment(ageByTreatmentData);

    // 3. Annual New Patient Growth
    const yearMap: { [key: number]: number } = {};
    data.forEach(p => {
      if (p.date_of_record) {
        const year = new Date(p.date_of_record).getFullYear();
        yearMap[year] = (yearMap[year] || 0) + 1;
      }
    });

    const annualGrowthData = Object.entries(yearMap)
      .map(([year, count]) => ({
        year: parseInt(year),
        new_patients: count
      }))
      .sort((a, b) => a.year - b.year);

    setAnnualGrowth(annualGrowthData);

    // 4. Patient Counts by Birth Year
    const birthYearMap: { [key: number]: number } = {};
    data.forEach(p => {
      if (p.birthday) {
        const birthYear = new Date(p.birthday).getFullYear();
        birthYearMap[birthYear] = (birthYearMap[birthYear] || 0) + 1;
      }
    });

    const birthYearData = Object.entries(birthYearMap)
      .map(([year, count]) => ({
        birth_year: parseInt(year),
        patient_count: count
      }))
      .sort((a, b) => a.birth_year - b.birth_year);

    setBirthYearCounts(birthYearData);

    // 5. Gender Counts by Diagnosis
    const genderDiagnosisMap: { [key: string]: { male: number; female: number; other: number } } = {};
    data.forEach(p => {
      if (p.diagnosis) {
        if (!genderDiagnosisMap[p.diagnosis]) {
          genderDiagnosisMap[p.diagnosis] = { male: 0, female: 0, other: 0 };
        }
        const gender = p.gender?.toLowerCase();
        if (gender === 'male') genderDiagnosisMap[p.diagnosis].male++;
        else if (gender === 'female') genderDiagnosisMap[p.diagnosis].female++;
        else genderDiagnosisMap[p.diagnosis].other++;
      }
    });

    const genderByDiagnosisData = Object.entries(genderDiagnosisMap)
      .map(([diagnosis, counts]) => ({
        diagnosis,
        male_count: counts.male,
        female_count: counts.female,
        other_count: counts.other
      }))
      .sort((a, b) => (b.male_count + b.female_count + b.other_count) - (a.male_count + a.female_count + a.other_count));

    setGenderByDiagnosis(genderByDiagnosisData);

    // 6. Top Treatments by Utilization
    const treatmentUtilizationMap: { [key: string]: number } = {};
    data.forEach(p => {
      if (p.treatment) {
        treatmentUtilizationMap[p.treatment] = (treatmentUtilizationMap[p.treatment] || 0) + 1;
      }
    });

    const topTreatmentsData = Object.entries(treatmentUtilizationMap)
      .map(([treatment_type, count]) => ({
        treatment_type,
        utilization_count: count
      }))
      .sort((a, b) => b.utilization_count - a.utilization_count);

    setTopTreatments(topTreatmentsData);
  };

  useEffect(() => {
    fetchPatientRecords();

    // Set up real-time subscription
    const subscription = supabase
      .channel('patient_records_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'patientrecords' }, 
        (payload) => {
          console.log('Real-time change detected:', payload);
          fetchPatientRecords();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let filtered = records;

    if (searchTerm) {
      filtered = filtered.filter(record => 
        `${record.first_name || ''} ${record.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.patient_id?.toString() || '').includes(searchTerm)
      );
    }

    if (selectedGender !== 'all') {
      filtered = filtered.filter(record => 
        record.gender?.toLowerCase() === selectedGender.toLowerCase()
      );
    }

    setFilteredRecords(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, selectedGender, records]);

  // Pagination calculations
  const displayRecordsPerPage = showAllRecords ? filteredRecords.length : recordsPerPage;
  const totalPages = Math.ceil(filteredRecords.length / displayRecordsPerPage);
  const startIndex = (currentPage - 1) * displayRecordsPerPage;
  const endIndex = startIndex + displayRecordsPerPage;
  const currentRecords = showAllRecords ? filteredRecords : filteredRecords.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPatientFullName = (record: PatientRecord) => {
    return `${record.first_name || ''} ${record.last_name || ''}`.trim() || 'Unknown Patient';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (birthday: string | null) => {
    if (!birthday) return 'N/A';
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-white">Loading patient analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 font-sans">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={onBackToHome}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg px-2 py-1"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-600 hidden sm:block"></div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white font-display">Patient Analytics Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={fetchPatientRecords}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <div className="text-xs sm:text-sm text-gray-300 hidden md:block">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InfoTooltip content="Total number of active patients in the system">
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-primary-500 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-300 font-medium">Total Patients</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white font-display">{stats.totalPatients}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </InfoTooltip>

          <InfoTooltip content="Average age of all patients">
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-accent-500 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-300 font-medium">Average Age</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white font-display">{stats.averageAge}</p>
                  <p className="text-xs text-gray-400">years old</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </InfoTooltip>

          <InfoTooltip content="New patient records added in the last 30 days">
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-secondary-500 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-300 font-medium">Recent Records</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white font-display">{stats.recentRecords}</p>
                  <p className="text-xs text-gray-400">last 30 days</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </InfoTooltip>

          <InfoTooltip content="Distribution of male and female patients">
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-warning-500 group hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-300 font-medium">Gender Split</p>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-base sm:text-lg font-bold text-primary-400 font-display">{stats.malePatients}M</span>
                  <span className="text-gray-500">/</span>
                  <span className="text-base sm:text-lg font-bold text-secondary-400 font-display">{stats.femalePatients}F</span>
                </div>
                {/* Mini progress bar */}
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(stats.malePatients / (stats.malePatients + stats.femalePatients)) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-warning-500 to-warning-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          </InfoTooltip>
        </div>

        {/* Analytics Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Patient Diagnosis Summary */}
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center space-x-2 font-display">
              <PieChart className="w-5 h-5 text-primary-500" />
              <span>Patient Diagnosis Summary</span>
            </h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diagnosisSummary.slice(0, 6).map((item, index) => ({
                      name: item.diagnosis,
                      value: item.total_patient,
                      fill: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#D946EF'][index]
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => window.innerWidth < 640 ? `${(percent * 100).toFixed(0)}%` : `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={window.innerWidth < 640 ? 60 : 80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {diagnosisSummary.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#D946EF'][index]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Age by Treatment */}
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center space-x-2 font-display">
              <Activity className="w-5 h-5 text-accent-500" />
              <span>Average Age by Treatment</span>
            </h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageByTreatment.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="treatment_type" 
                    stroke="#9CA3AF" 
                    angle={-45} 
                    textAnchor="end" 
                    height={window.innerWidth < 640 ? 80 : 100}
                    fontSize={window.innerWidth < 640 ? 10 : 12}
                  />
                  <YAxis stroke="#9CA3AF" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar 
                    dataKey="average_age" 
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    style={{ cursor: 'default' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Annual New Patient Growth */}
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center space-x-2 font-display">
              <LineChart className="w-5 h-5 text-secondary-500" />
              <span>Annual New Patient Growth</span>
            </h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={annualGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="new_patients" 
                    stroke="#D946EF"
                    strokeWidth={3}
                    dot={{ fill: '#D946EF', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#D946EF', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Treatments by Utilization */}
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center space-x-2 font-display">
              <Pill className="w-5 h-5 text-warning-500" />
              <span>Top Treatments by Utilization</span>
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {topTreatments.slice(0, 8).map((item, index) => (
                <div key={index} className="flex items-center justify-between group/item hover:bg-gray-700/50 rounded-lg p-2 transition-colors duration-200">
                  <span className="text-sm text-gray-300 flex-1">{item.treatment_type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-warning-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(item.utilization_count / Math.max(...topTreatments.map(t => t.utilization_count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-white w-8 text-right font-display">{item.utilization_count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gender Counts by Diagnosis */}
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-8 group">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center space-x-2 font-display">
            <Users className="w-5 h-5 text-primary-500" />
            <span>Gender Distribution by Diagnosis</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/80">
                <tr>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase font-display">Diagnosis</th>
                  <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-gray-300 uppercase font-display">Male</th>
                  <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-gray-300 uppercase font-display">Female</th>
                  <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-gray-300 uppercase hidden sm:table-cell font-display">Other</th>
                  <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-gray-300 uppercase font-display">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600/50">
                {genderByDiagnosis.slice(0, 6).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-700/50 transition-colors duration-200">
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-white truncate max-w-32 sm:max-w-none">{item.diagnosis}</td>
                    <td className="px-2 sm:px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 font-display">
                        {item.male_count}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 font-display">
                        {item.female_count}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-center hidden sm:table-cell">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-display">
                        {item.other_count}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-center font-medium text-white text-xs sm:text-sm font-display">
                      {item.male_count + item.female_count + item.other_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search patients, diagnoses, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700/80 border border-gray-600/50 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all duration-200 hover:bg-gray-700"
                />
              </div>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="px-4 py-2 bg-gray-700/80 border border-gray-600/50 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:w-auto transition-all duration-200 hover:bg-gray-700"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <select
                value={showAllRecords ? 'all' : recordsPerPage.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'all') {
                    setShowAllRecords(true);
                    setCurrentPage(1);
                  } else {
                    setShowAllRecords(false);
                    setRecordsPerPage(parseInt(value));
                    setCurrentPage(1);
                  }
                }}
                className="px-4 py-2 bg-gray-700/80 border border-gray-600/50 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:w-auto transition-all duration-200 hover:bg-gray-700"
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
                <option value="200">200 per page</option>
                <option value="all">Show All</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs sm:text-sm">
              <div className="text-accent-400 font-semibold font-display">
                Total Records: {records.length} | Filtered: {filteredRecords.length}
              </div>
              <div className="text-gray-300">
                {showAllRecords ? (
                  <span>Showing all {filteredRecords.length} patients</span>
                ) : (
                  <span>Showing {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length} patients</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Records Table with Pagination */}
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-600/50 bg-gray-700/30">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center space-x-2 font-display">
              <FileText className="w-5 h-5" />
              <span>Patient Records</span>
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-700/80">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider font-display">
                    Patient
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider font-display">
                    Age/Gender
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell font-display">
                    Diagnosis
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell font-display">
                    Treatment
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell font-display">
                    Contact
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider font-display">
                    Record Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/50 divide-y divide-gray-600/50">
                {currentRecords.map((record) => (
                  <tr key={record.patient_id} className="hover:bg-gray-700/50 transition-colors duration-200">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-xs sm:text-sm font-medium text-white truncate max-w-32 sm:max-w-none font-display">
                        {getPatientFullName(record)}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">ID: {record.patient_id}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm text-white font-display">
                        {record.age || calculateAge(record.birthday)} years
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {record.gender || 'N/A'}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                      <div className="text-xs sm:text-sm text-white max-w-32 sm:max-w-xs truncate">
                        {record.diagnosis || 'No diagnosis'}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                      <div className="text-xs sm:text-sm text-white max-w-32 sm:max-w-xs truncate">
                        {record.treatment || 'No treatment specified'}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-xs sm:text-sm text-white flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span className="truncate max-w-24 sm:max-w-none font-mono">{record.phone_number || 'N/A'}</span>
                      </div>
                      {record.emergency_contact_name && (
                        <div className="text-xs text-gray-400 truncate max-w-24 sm:max-w-none">
                          Emergency: {record.emergency_contact_name}
                        </div>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-white font-mono">
                      {formatDate(record.date_of_record)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!showAllRecords && totalPages > 1 && (
            <div className="px-3 sm:px-6 py-4 border-t border-gray-600/50 bg-gray-700/30 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <span className="text-xs">First</span>
                </button>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs sm:text-sm text-gray-300 px-2 sm:px-4 font-display">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <span className="text-xs">Last</span>
                </button>
              </div>
            </div>
          )}
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No patient records found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Real-time Updates Notice */}
        <div className="mt-8 bg-accent-900/20 border border-accent-700/50 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-accent-500" />
            <span className="text-sm sm:text-base text-accent-400 font-medium font-display">Live Database Connection</span>
          </div>
          <p className="text-accent-300 mt-1 text-xs sm:text-sm">
            This dashboard is connected to your Supabase database and updates automatically when changes are made. 
            All reports and analytics refresh in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;