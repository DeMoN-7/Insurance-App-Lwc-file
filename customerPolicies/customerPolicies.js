import { LightningElement, api, wire } from 'lwc';
import getPolicies from '@salesforce/apex/InsuranceAppController.getPolicies';
import surrenderPolicy from '@salesforce/apex/InsuranceAppController.surrenderPolicy';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CustomerPolicies extends LightningElement {
    @api contactId;
    policies = [];
    wiredResult;

    columns = [
        { label: 'Insurance No', fieldName: 'Insurance_No__c' },
        { label: 'Type', fieldName: 'Insurance_Type__c' },
        { label: 'Value', fieldName: 'Insurance_value__c' },
        { label: 'Status', fieldName: 'Status__c' },
        {
            type: 'button',
            typeAttributes: {
                label: 'Surrender',
                name: 'surrender',
                variant: 'destructive'
            },
            cellAttributes: {
                class: { fieldName: 'rowClass' }
            }
        }
    ];

    @wire(getPolicies, { contactId: '$contactId' })
wiredPolicies(result) {
    this.wiredResult = result;

    if (result.data) {
        this.policies = result.data.map(p => ({
            ...p,
            disableSurrender:
                p.Status__c === 'SURRENDERED' || p.Status__c === 'CLAIMED'
        }));
    }
}

    handleRowAction(event) {
        const row = event.detail.row;

        surrenderPolicy({ policyId: row.Id })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Policy surrendered successfully',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredResult);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}