import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany
} from 'typeorm';

// Para evitar conflito de nome com a classe User, podemos nomear a entidade de forma diferente se necessário
// ou usar `import { User as UserModel } from ...` nos controllers/services.

@Entity('users') // Nome da tabela no banco de dados
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true, where: `"clerk_id" IS NOT NULL` }) // Índice único condicional para clerk_id não nulo
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'clerk_id' })
  clerkId?: string;

  @Index({ unique: true, where: "email IS NOT NULL" })
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'email_verified_at' })
  emailVerifiedAt?: Date;

  @Index({ unique: true, where: `"phone_number" IS NOT NULL` })
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'phone_number' })
  phoneNumber?: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'phone_verified_at' })
  phoneVerifiedAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'password_hash', select: false })
  passwordHash?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'full_name' })
  fullName?: string;

  @Column({ type: 'text', nullable: true, name: 'image_url' })
  imageUrl?: string;

  @Column({ type: 'varchar', length: 50, default: 'traveler' })
  role: string; // Ex: traveler, partner, employee, master

  // Relacionamento para employees: um Partner (usuário) pode ter muitos Employees (outros usuários)
  // Um Employee pertence a um Partner (usuário)
  @Column({ type: 'uuid', nullable: true, name: 'partner_id' }) // Armazena o ID do usuário que é o "Partner"
  partnerEntityId?: string; // Nome diferente para evitar confusão com a propriedade de relação abaixo

  @ManyToOne(() => User, user => user.employees, { nullable: true, onDelete: 'SET NULL' }) // Se o partner for deletado, o partner_id dos employees vira NULL
  @JoinColumn({ name: 'partner_entity_id' }) // Chave estrangeira real no banco
  partner?: User; // O "chefe" (Partner) deste usuário (Employee)

  @OneToMany(() => User, user => user.partner)
  employees?: User[]; // Os Employees deste Partner (se este usuário for um Partner)

  @Column({ type: 'uuid', nullable: true, name: 'organization_id' }) // Futuramente FK para uma tabela 'organizations'
  organizationId?: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
  dateOfBirth?: Date; // Armazenar como YYYY-MM-DD

  @Column({ type: 'boolean', default: false, name: 'onboarding_completed' })
  onboardingCompleted: boolean;

  @Column({ type: 'timestamptz', nullable: true, name: 'onboarding_completed_at' })
  onboardingCompletedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}
