/**
 *
 * Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
 *
 */
import * as yup from 'yup';
import { Id, Mandatory, Validate, Default, Validator } from '../lib/decorators';
import { OchainModel } from '../lib/ochain-model';

@Id('lotNumber')
export class Myasset extends OchainModel<Myasset> {

    public readonly assetType = 'SeedCert_ChainCode.myasset';
    
    @Mandatory()
    @Validate(yup.string().matches(new RegExp('/^[a-A0-9]{5}[-]{1}[0-9]{2}[-]{1}[0-9]{3}[-]{1}[0-9]{3}([(][0-9]+[)])$/')))
    @Default('XXX12-34-567-890(1)')
    public lotNumber: string;
    
    @Mandatory()
    @Validate(yup.string().max(100))
    @Default('N/A')
    public owner:string;
    
    @Mandatory()
    @Validate(yup.string().max(100))
    @Default('N/A')
    public cropName:string;
    
    @Mandatory()
    @Validate(yup.string().max(100))
    @Default('N/A')
    public variety: string;

    @Mandatory()
    @Validate(yup.string().matches(new RegExp(/^F[0-9]{10}/))
    @Default('N/A')
    public sourceTagNumber:string;
    
    @Mandatory()
    @Validate(yup.string().matches(new RegExp(/^(Breeder|Foundation-1|Foundation-2)$/)))
    @Default('N/A')
    public sourceClass: string;

    @Mandatory()
    @Validate(yup.string().matches(new RegExp(/^(Certified-1|Certified-2)$/)))
    @Default('N/A')
    public destinationClass: string;

    @Mandatory()
    @Validate(yup.number().positive())
    @Default(-1)
    public sourceQuantity: number;

    @Mandatory()
    @Default(null)
    public sourceDateOfIssue: Date;

    @Mandatory()
    @Validate(yup.string().max(100))
    @Default('N/A')
    public growerName: string;

    @Mandatory()
    @Validate(yup.string().max(100))
    @Default('N/A')
    public SPAName: string;
    
    @Mandatory()
    @Validate(yup.string().max(500))
    @Default('N/A')
    public sourceStoreHouse: string;

    @Mandatory()
    @Validate(yup.string().max(500))
    @Default('N/A')
    public destinationStoreHouse: string;

    @Mandatory()
    @Validate(yup.string().max(100))
    @Default('N/A')
    public SGName: string;

    @Mandatory()
    @Validate(yup.string().matches(new RegExp(/^[A-Z]{2}[-][0-9]{4}$/)))
    @Default('N/A')
    public SGId: string;

    @Mandatory()
    @Default(null)
    public finYear: Date;

    @Mandatory()
    @Validate(yup.string().max(50))
    @Default('N/A')
    public season: string;

    @Mandatory()
    @Validate(yup.number().positive())
    @Default(-1)
    public landRecordKhataNumber: number;

    @Mandatory()
    @Validate(yup.number().positive())
    @Default(-1)
    public landRecordPlotNumber: number;

    @Mandatory()
    @Validate(yup.string().matches(new RegExp(/^[A-Z]{1}[0-9]+[-][0-9]+[-][0-9]+$/)))
    @Default('N/A')
    public cropRegCode: string;

    @Mandatory()
    @Validate(yup.string().max(100))
    @Default('N/A')
    public SPPName: string;

    @Mandatory()
    @Validate(yup.string().matches(new RegExp(/^[0-9]+[-][0-9]+/)))
    @Default('N/A')
    public SPPId: string;

    @Mandatory()
    @Validate(yup.number().positive())
    @Default('N/A')
    public totalQuantityProcessed: number;

    @Mandatory()
    @Default(null)
    public processingDate: Date;

    @Mandatory()
    @Default(null)
    public verificationDate: Date;

    @Mandatory()
    @Validate(yup.string().max(11))
    @Default('N/A')
    public sampleSecreteCode: string;

    @Mandatory()
    @Default(false)
    public samplePassed: boolean;

    @Mandatory()
    @Default(null)
    public sampleTestDate: Date;

    @Mandatory()
    @Default('N/A')
    @Validate(yup.string().max(9))
    public certificateNumber: string;

    @Mandatory()
    @Default(null)
    public certificateDate: Date;

    @Mandatory()
    @Validate(yup.string().matches(new RegExp(/^[A-Z]{1}[0-9][4]$/)))
    public tagSeries: string;

    @Mandatory()
    @Validate(yup.string().matches(new RegExp(/^[A-Z]{1}[0-9]{4}[-][0-9]{7}$/)))
    @Default('N/A')
    public tagIssueRangeFrom: string;

    @Mandatory()
    @Validate(yup.string().matches(new RegExp(/^[A-Z]{1}[0-9]{4}[-][0-9]{7}$/)))
    @Default('N/A')
    public tagIssueRangeTo: string;

    @Mandatory()
    @Validate(yup.number().positive())
    @Default(-1)
    public numberofTagsIssued: number;

    @Mandatory()
    @Validate(yup.number().max(12).min(1))
    @Default(-1)
    public certificateValidityInMonth: number;

    
}

