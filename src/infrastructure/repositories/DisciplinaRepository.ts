import { Disciplina } from "../../domains/secretary";
import { createPrismaClient } from "../prisma";
import { IDisciplinaRepository } from "../types/IDisciplinaRepository";

export class DisciplinaRepository implements IDisciplinaRepository {
  private prisma = createPrismaClient()
  
  public async get(disciplinaId?: number, nome?: string): Promise<Disciplina | null> {
    const response_database = await this.prisma.disciplina.findUnique({
      where: {
          id_disciplina: disciplinaId,
          ...(nome && { nome })
        }
    })

    if(!response_database) return null
    
    return new Disciplina({
      disciplinaId: response_database!.id_disciplina,
      disponivel: response_database!.disponivel,
      ead: response_database!.ead,
      nome: response_database!.nome,
      valor: response_database!.valor,
    });
  }

  public async getAll(): Promise<Disciplina[]> {
    return new Array(
      new Disciplina({
        disciplinaId: 1,
        disponivel: true,
        ead: true,
        nome: "Engenharia de Software",
        valor: 23.24,
      })
    );
  }

  public async create(
    disciplina: Omit<Disciplina, "disciplinaId">
  ): Promise<Omit<Disciplina, "disciplinaId">> {
    const disciplinaCriada = await this.prisma.disciplina.create({
      data: disciplina
    })

    return new Disciplina(disciplinaCriada)
  }

  public async update(
    disciplinaId: Disciplina["disciplinaId"],
    disciplina: Partial<Disciplina>
  ): Promise<Disciplina> {
    // temporario: para mockar o que o próprio Prisma ORM faria
    let disciplinaToBeUpdated: Partial<Disciplina> = new Disciplina({
      disciplinaId: 1,
      disponivel: true,
      ead: true,
      nome: "Engenharia de Software",
      valor: 23.24,
    });

    disciplinaToBeUpdated = {
      disciplinaId,
      ...disciplina,
    };

    return new Promise<Disciplina>(() => disciplinaToBeUpdated);
  }
}
