import sys

def revert():
    schema_path = 'server/prisma/schema.prisma'
    env_path = 'server/.env'
    
    # Revert schema.prisma
    with open(schema_path, 'r') as f:
        content = f.read()
    
    # Revert datasource
    content = content.replace('provider = "sqlite"', 'provider = "postgresql"')
    content = content.replace('url      = "file:./dev.db"', 'url      = env("DATABASE_URL")')
    
    # Revert enums (this is a bit manual but I know the structure)
    if 'enum Role' not in content:
        enum_defs = """enum Role {
  ADMIN
  MEMBER
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
}

"""
        content = content.replace('model User {', enum_defs + 'model User {')
        content = content.replace('role String @default("MEMBER")', 'role Role @default(MEMBER)')
        content = content.replace('status      String       @default("TODO")', 'status      TaskStatus   @default(TODO)')
        content = content.replace('priority    String       @default("MEDIUM")', 'priority    TaskPriority @default(MEDIUM)')
    
    with open(schema_path, 'w') as f:
        f.write(content)
        
    print("Reverted schema.prisma to PostgreSQL.")

if __name__ == "__main__":
    revert()
