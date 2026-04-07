import { LightningElement, wire } from 'lwc';
import getCustomers from '@salesforce/apex/InsuranceAppController.getCustomers';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Total Policies', fieldName: 'Total_number_of_policies__c' },
    { label: 'Life', fieldName: 'Total_no_of_Life_Insurance__c' },
    { label: 'Motor', fieldName: 'Total_no_of_Motor_insurance__c' },
    {
        type: 'button',
        typeAttributes: {
            label: 'View Policies',
            name: 'view',
            variant: 'brand'
        }
    }
];

export default class InsuranceCustomers extends LightningElement {
    customers;
    columns = COLUMNS;

    selectedContactId;
    isModalOpen = false;

    @wire(getCustomers)
    wiredCust({ data, error }) {
        if (data) {
            this.customers = data;
        }
        if (error) {
            console.error(error);
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'view') {
            this.selectedContactId = row.Id;
            this.isModalOpen = true;
        }
    }

    closeModal() {
        this.isModalOpen = false;
    }
}