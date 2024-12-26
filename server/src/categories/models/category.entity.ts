import { Expense } from 'src/expenses/models/expenses.entity';
import { User } from 'src/users/models/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Budget } from './budget.entity';

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // One category can have multiple expenses
    @OneToMany(() => Expense, (expense) => expense.category)
    expenses: Expense[];

    @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Budget, (budget) => budget.category)
    budgets: Budget[];
}
