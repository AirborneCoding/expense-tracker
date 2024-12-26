import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/models/users.entity';
import { Category } from 'src/categories/models/category.entity';

@Entity({ name: 'expenses' })
export class Expense {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.expenses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'uuid' })
    user_id: string;

    @ManyToOne(() => Category, (category) => category.expenses, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ type: 'uuid' })
    category_id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 }) // Stores monetary amounts
    amount: number;

    @Column({ type: 'timestamp' })
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
