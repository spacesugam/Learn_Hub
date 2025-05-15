// src/components/dashboard/AdminAnalytics.jsx
'use client'; // If using Next.js App Router

import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement, // For Pie/Doughnut
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import './AdminAnalytics.css'; // For custom styling

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement,
    Title, Tooltip, Legend, Filler
);

const AdminAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadAnalytics = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await api.getAnalyticsData();
                setAnalyticsData(data);
            } catch (err) {
                console.error("Error fetching analytics data:", err);
                setError("Could not load analytics. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        loadAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                <p className="mt-3 lead">Loading Analytics Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger" className="text-center">{error}</Alert>;
    }

    if (!analyticsData) {
        return <Alert variant="info" className="text-center">No analytics data available yet.</Alert>;
    }

    // Chart data and options
    const registrationChart = {
        labels: analyticsData.registrationTrend.labels,
        datasets: [{
            label: 'New User Registrations (Last 30 Days)',
            data: analyticsData.registrationTrend.data,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.3,
            fill: true,
        }],
    };

    const categoryChart = {
        labels: analyticsData.courseCategoryDistribution.labels,
        datasets: [{
            label: 'Courses by Category',
            data: analyticsData.courseCategoryDistribution.data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)',
                'rgba(199, 199, 199, 0.7)', 'rgba(83, 102, 255, 0.7)'
            ],
            borderColor: '#fff',
            borderWidth: 2,
        }],
    };

    const topCoursesChart = {
        labels: analyticsData.topCoursesByEnrollment.labels,
        datasets: [{
            label: 'Top 10 Courses by Enrollment',
            data: analyticsData.topCoursesByEnrollment.data,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
        }],
    };

    const userRolesChart = {
        labels: analyticsData.userRoleDistribution.labels,
        datasets: [{
            label: 'User Roles',
            data: analyticsData.userRoleDistribution.data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)', // Admin
                'rgba(54, 162, 235, 0.8)', // Faculty
                'rgba(255, 206, 86, 0.8)', // User
            ],
            hoverOffset: 4,
        }],
    };

    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Important for custom height
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#495057', // Legend text color
                    font: { size: 13 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.75)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 10,
                cornerRadius: 4,
            }
        },
        scales: { // Only applicable for Line/Bar
            y: {
                beginAtZero: true,
                ticks: { color: '#6c757d' }, // Y-axis tick color
                grid: { color: 'rgba(0,0,0,0.05)' }
            },
            x: {
                ticks: { color: '#6c757d' }, // X-axis tick color
                grid: { display: false }
            }
        }
    };
     const pieDoughnutOptions = {
        ...commonChartOptions,
        scales: undefined, // Remove scales for pie/doughnut
         plugins: {
            ...commonChartOptions.plugins,
            legend: {
                position: 'right', // Better for pie/doughnut
                 labels: {
                    color: '#495057',
                    font: { size: 13 },
                    boxWidth: 20,
                    padding: 15
                }
            }
        }
    };


    return (
        <div className="admin-analytics-page pt-3">
            <Row className="g-4">
                <Col lg={12}>
                    <Card className="analytics-chart-card shadow-sm">
                        <Card.Header as="h5" className="analytics-card-header">
                            <i className="fas fa-users-line me-2 text-primary"></i> User Registrations
                        </Card.Header>
                        <Card.Body>
                            <div className="chart-container" style={{ height: '350px' }}>
                                <Line options={commonChartOptions} data={registrationChart} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={4}>
                    <Card className="analytics-chart-card shadow-sm h-100">
                        <Card.Header as="h5" className="analytics-card-header">
                            <i className="fas fa-pie-chart me-2 text-success"></i> Course Categories
                        </Card.Header>
                        <Card.Body className="d-flex justify-content-center align-items-center">
                            <div className="chart-container-pie" style={{ height: '300px', width:'100%' }}>
                                <Pie options={pieDoughnutOptions} data={categoryChart} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={4}>
                    <Card className="analytics-chart-card shadow-sm h-100">
                         <Card.Header as="h5" className="analytics-card-header">
                            <i className="fas fa-user-tag me-2 text-info"></i> User Roles
                        </Card.Header>
                        <Card.Body className="d-flex justify-content-center align-items-center">
                             <div className="chart-container-pie" style={{ height: '300px', width:'100%' }}>
                                <Doughnut options={pieDoughnutOptions} data={userRolesChart} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col lg={12} xl={4}> {/* Make top courses take full width on lg, then share on xl */}
                     <Card className="analytics-chart-card shadow-sm h-100"> {/* Use h-100 if it's in a row with other h-100 cards */}
                        <Card.Header as="h5" className="analytics-card-header">
                           <i className="fas fa-graduation-cap me-2 text-warning"></i> Top Courses by Enrollment
                        </Card.Header>
                        <Card.Body>
                            <div className="chart-container" style={{ height: '300px' }}> {/* Ensure this matches height of pie/doughnut if in same row */}
                                <Bar options={{...commonChartOptions, indexAxis: 'y' }} data={topCoursesChart} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Add more charts here as needed */}
                {/* Example: Course Status (Published vs Draft) */}
                {/* Example: Revenue Trend (if you track daily revenue) */}

            </Row>
        </div>
    );
};

export default AdminAnalytics;