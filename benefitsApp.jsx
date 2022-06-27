// 'use strict';

import React from "react";
// import ReactDOM from "react-dom";

const benefitsForm = document.getElementById('formBenefits');
const btnPreview = document.getElementById('btnPreview');

export default class BenefitsPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onLoad: true,
            onSearch: false,
            preHALink: '',
            data: ''
        };
    }

    componentDidMount() {
        benefitsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!this.state.onSearch) {
                const memberId = document.getElementById('txtMemberID').value.trim();
                if (memberId.startsWith('94') && memberId.length == 11) {
                    this.setState({
                        onLoad: false,
                        onSearch: true,
                        preHA: ''
                    });
                    this.getMemberBenefits(btnPreview, memberId);
                } else {
                    // Set preHA to correct site based on path 
                    this.setState({
                        onLoad: false,
                        onSearch: false,
                        preHA: 'error'
                    });
                }
            }
        });
    }

    getMemberBenefits(elem, id) {
        fetch(`https://api.healthalliance.org/members/${id}/planOverview`)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    onSearch: false,
                    data: {
                        ...responseJson,
                        currentPlan: responseJson.plans[0].currentPlan,
                        planStartDate: new Date(responseJson.plans[0].currentPlan.start).toLocaleDateString()
                    }
                });
                elem.disabled = false;
            });
    }

    render() {
        if (this.state.onLoad) {
            return null;
        }
        if (this.state.onSearch) {
            return (
                <div>
                    <div className="card--divider"></div>
                    <div className="flex-container align-center">
                        <div className="status--loading"></div>
                    </div>
                </div>
            );
        }
        if (this.state.preHA !== '') {
            return (
                <div>
                    <div className="card--divider">Oops!</div>
                    <div className="flex-container flex-dir-column align-center-middle">
                        <p>Please enter your 11 digit member ID without dashes.</p>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <div className="card--divider">This is a preview of your plan benefit information</div>
                <div className="grid-x grid-padding-x medium-up-2">
                    <div className="cell">
                        <ul className="no-bullet padded-bullet">
                            <li><strong>Plan: </strong>{this.state.data.currentPlan.name}</li>
                            <li><strong>Group ID: </strong>{this.state.data.groupId}</li>
                            <li><strong>Coverage Dates: </strong>{this.state.data.planStartDate} - </li>
                            {this.state.data.currentPlan.docUrl !== null &&
                                <li>
                                    <a href={this.state.data.currentPlan.docUrl}>Plan Overview</a>
                                </li>
                            }
                            {this.state.data.currentPlan.providerSearchUrl !== null &&
                                <li>
                                    <a href={this.state.data.currentPlan.providerSearchUrl}>Doctor or Hospitals Search</a>
                                </li>
                            }
                            {this.state.data.currentPlan.prescriptionDrugUrl !== null &&
                                <li>
                                    <a href={this.state.data.currentPlan.prescriptionDrugUrl}>Covered Drugs</a>
                                </li>
                            }
                            {this.state.data.currentPlan.wellnessUrl !== null &&
                                <li>
                                    <a href={this.state.data.currentPlan.wellnessUrl}>Preventative Service Benefits</a>
                                </li>
                            }
                        </ul>
                    </div>
                    <div className="cell">
                        <ul className="no-bullet padded-bullet">
                            {this.state.data.customerServiceInformation.careCoordinationPhone !== null &&
                                <li><strong>Care Coordination: </strong><a href={`tel:${this.state.data.customerServiceInformation.careCoordinationPhone.replace('. ext. ', ',')}`}>{this.state.data.customerServiceInformation.careCoordinationPhone.replace('1–800-', '(800) ')}</a></li>
                            }
                            {this.state.data.customerServiceInformation.phone !== null &&
                                <li><strong>Customer Service: </strong><a href={`tel:${this.state.data.customerServiceInformation.phone}`}>{this.state.data.customerServiceInformation.phone.replace('1-800-', '(800) ')}</a><br />
                                <a href="mailto:CustomerService@healthalliance.org">CustomerService@healthalliance.org</a>
                            </li>
                            }
                            {this.state.data.customerServiceInformation.ttyRelay !== null &&
                                <li><strong>Relay: </strong><a href={`tel:${this.state.data.customerServiceInformation.ttyRelay}`}>{this.state.data.customerServiceInformation.ttyRelay.replace('1-800-', '(800) ')}</a></li>
                            }
                        </ul>
                    </div>
                </div>
                <div className="grid-x grid-padding-x section-padding-small">
                    <div className="cell">
                        <table className="striped hover">
                            <thead>
                                <tr>
                                    <th></th>
                                    {this.state.data.currentPlan.tierOne !== null &&
                                        <th>Preferred Network</th>
                                    }
                                    <th>In Network</th>
                                    <th>Out of Network</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Individual Deductible</td>
                                    {this.state.data.currentPlan.tierOne !== null &&
                                        <td>{this.state.data.currentPlan.tierOne.individualDeductible}</td>
                                    }
                                    <td>{this.state.data.currentPlan.preferred.individualDeductible}</td>
                                    <td>{this.state.data.currentPlan.nonPreferred.individualDeductible}</td>
                                </tr>
                                {this.state.data.currentPlan.preferred.familyDeductible !== '' &&
                                    <tr>
                                        <td>Family Deductible</td>
                                        <td>{this.state.data.currentPlan.preferred.familyDeductible}</td>
                                        <td>{this.state.data.currentPlan.nonPreferred.familyDeductible}</td>
                                    </tr>
                                }
                                <tr>
                                    <td>Individual Out-of-Pocket Max</td>
                                    {this.state.data.currentPlan.tierOne !== null &&
                                        <td>{this.state.data.currentPlan.tierOne.individualOutOfPocketMax}</td>
                                    }
                                    <td>{this.state.data.currentPlan.preferred.individualOutOfPocketMax}</td>
                                    <td>{this.state.data.currentPlan.nonPreferred.individualOutOfPocketMax}</td>
                                </tr>
                                {this.state.data.currentPlan.preferred.familyOutOfPocketMax !== '' &&
                                    <tr>
                                        <td>Family Out-of-Pocket Max</td>
                                        <td>{this.state.data.currentPlan.preferred.familyOutOfPocketMax}</td>
                                        <td>{this.state.data.currentPlan.nonPreferred.familyOutOfPocketMax}</td>
                                    </tr>
                                }
                                <tr>
                                    <td>Primary Care Visit</td>
                                    {this.state.data.currentPlan.tierOne !== null &&
                                        <td>{this.state.data.currentPlan.tierOne.primaryCareVisit}</td>
                                    }
                                    <td>{this.state.data.currentPlan.preferred.primaryCareVisit}</td>
                                    <td>{this.state.data.currentPlan.nonPreferred.primaryCareVisit}</td>
                                </tr>
                                <tr>
                                    <td>Specialty Visit</td>
                                    {this.state.data.currentPlan.tierOne !== null &&
                                        <td>{this.state.data.currentPlan.tierOne.specialtyVisit}</td>
                                    }
                                    <td>{this.state.data.currentPlan.preferred.specialtyVisit}</td>
                                    <td>{this.state.data.currentPlan.nonPreferred.specialtyVisit}</td>
                                </tr>
                                <tr>
                                    <td>Emergency Care</td>
                                    {this.state.data.currentPlan.tierOne !== null &&
                                        <td>{this.state.data.currentPlan.tierOne.emergencyCare}</td>
                                    }
                                    <td>{this.state.data.currentPlan.preferred.emergencyCare}</td>
                                    <td>{this.state.data.currentPlan.nonPreferred.emergencyCare}</td>
                                </tr>
                                <tr>
                                    <td>Urgent Care</td>
                                    {this.state.data.currentPlan.tierOne !== null &&
                                        <td>{this.state.data.currentPlan.tierOne.urgentCare}</td>
                                    }
                                    <td>{this.state.data.currentPlan.preferred.urgentCare}</td>
                                    <td>{this.state.data.currentPlan.nonPreferred.urgentCare}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-center">Get access to all your account details with Hally online.<br />
                        <a href="https://login.healthalliance.org/Account/Login" className="button rounded hollow">Log In or Register</a></p>
                    </div>
                </div>
            </div>
        );
    }
}