import { IsNotEmpty, IsNumber, IsUUID, IsDate, IsDateString, IsOptional } from 'class-validator';

export class CreateExpenseDto {
    @IsUUID()
    @IsNotEmpty()
    category_id: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    amount: number;

    @IsDateString()
    @IsNotEmpty()
    date: Date;
}


export class UpdateExpenseDto {
    @IsUUID()
    @IsOptional()
    category_id?: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    amount?: number;

    @IsDate()
    @IsOptional()
    date?: Date;
}
