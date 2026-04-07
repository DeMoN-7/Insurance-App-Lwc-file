import { LightningElement, wire } from 'lwc';
import getDashboardStats from '@salesforce/apex/InsuranceAppController.getDashboardStats';

export default class InsuranceDashboard extends LightningElement {
    stats = {};

    @wire(getDashboardStats)
    wiredStats({ data }) {
        if (data) this.stats = data;
    }
}