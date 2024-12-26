import { IsUUID, IsNotEmpty, IsNumber, IsString, IsEnum, IsDate, IsOptional, IsDateString } from 'class-validator';

export class CreateIncomeDto {

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    source: string; // E.g., Salary, Freelance, Gift

    @IsEnum(['Monthly', 'Weekly', 'One-Time'])
    @IsNotEmpty()
    frequency: 'Monthly' | 'Weekly' | 'One-Time';

    @IsNotEmpty()
    @IsDateString() 
    date_received: string
}


export class UpdateIncomeDto {

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    amount?: number;

    @IsString()
    @IsOptional()
    source?: string;

    @IsEnum(['Monthly', 'Weekly', 'One-Time'])
    @IsOptional()
    frequency?: 'Monthly' | 'Weekly' | 'One-Time';

    @IsOptional()
    @IsDateString()
    date_received?: string;
}