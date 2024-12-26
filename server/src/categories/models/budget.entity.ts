import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/users/models/users.entity';
import { Category } from './category.entity';

@Entity({ name: 'budgets' })
export class Budget {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.budgets, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'uuid' })
    user_id: string;

    @ManyToOne(() => Category, (category) => category.budgets, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ type: 'uuid' })
    category_id: string;

    // @Column({ type: 'decimal', precision: 10, scale: 2 }) // Budget amount
    // amount: number;

    @Column({
        type: 'decimal', precision: 10, scale: 2, transformer: {
            from: (value: string): number => parseFloat(value),
            to: (value: number): number => value
        }
    })
    amount: number; 

    @Column({ type: 'date' })
    start_date: Date;

    @Column({ type: 'date' })
    end_date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}