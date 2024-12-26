import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';
import { UserRole } from 'src/utils/enums';
import { Income } from 'src/incomes/model/incomes.entity';
import { Expense } from 'src/expenses/models/expenses.entity';
import { Category } from 'src/categories/models/category.entity';
import { Budget } from 'src/categories/models/budget.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 50 })
    @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
    username: string;

    @Column({ unique: true })
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @Column({ nullable: true })
    @Length(6, undefined, { message: 'Password must be at least 6 characters' })
    @Exclude()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        array: true,
        default: [UserRole.USER],
    })
    roles: UserRole[];

    @Column({ nullable: true })
    verificationToken?: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ type: 'timestamp', nullable: true })
    verified?: Date;

    @Column({ nullable: true })
    passwordToken?: string;

    @Column({ type: 'timestamp', nullable: true })
    passwordTokenExpirationDate?: Date;

    @Column({ unique: true, nullable: true })
    googleId?: string;

    @Column({ nullable: true })
    refreshToken?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // relations
    @OneToMany(() => Income, (track) => track.user)
    incomes: Income[];

    @OneToMany(() => Expense, (expense) => expense.user)
    expenses: Expense[];

    @OneToMany(() => Category, (category) => category.user)
    categories: Category[];

    @OneToMany(() => Budget, (budget) => budget.user)
    budgets: Budget[];
}


/* 
@BeforeInsert()
@BeforeUpdate()
async hashPassword(): Promise<void> {
    if (this.password) {
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
    }
}

async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
}
*/