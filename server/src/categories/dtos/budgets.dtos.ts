import { IsUUID, IsDecimal, IsDateString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateBudgetDto {
    // @IsUUID()
    // user_id: string;

    @IsUUID()
    category_id: string;

    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Amount must be a valid number' })
    @Min(0, { message: 'Amount must be greater than or equal to 0' })
    amount: number;

    @IsDateString({}, { message: 'Start date must be a valid ISO date string' })
    start_date: string;

    @IsDateString({}, { message: 'End date must be a valid ISO date string' })
    end_date: string;
}


export class UpdateBudgetDto {
    // @IsUUID()
    // @IsOptional()
    // user_id?: string;

    @IsUUID()
    @IsOptional()
    category_id?: string;

    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Amount must be a valid number' })
    @Min(0, { message: 'Amount must be greater than or equal to 0' })
    @IsOptional()
    amount?: number;

    @IsDateString({}, { message: 'Start date must be a valid ISO date string' })
    @IsOptional()
    start_date?: string;

    @IsDateString({}, { message: 'End date must be a valid ISO date string' })
    @IsOptional()
    end_date?: string;
}