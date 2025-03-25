import os
import argparse
from string import Template

def create_nest_module(full_module_name: str):
    # Convert "PresentationModule" to "presentation-module"
    module_kebab = ''.join(
        ['-' + char.lower() if char.isupper() and i > 0 else char.lower() 
         for i, char in enumerate(full_module_name)]
    ).lstrip('-')
    
    # Extract base name without "Module" suffix (for class names)
    module_class = full_module_name.replace('Module', '')

    # Define paths
    base_dir = os.path.join( "src", "presentation", module_kebab)
    dtos_dir = os.path.join(base_dir, "dtos")
    os.makedirs(dtos_dir, exist_ok=True)

    # Templates with empty variables
    templates = {
        "controller": Template("""import { Controller } from '@nestjs/common';

@Controller('${module_path}')
export class ${module_class}Controller {
    constructor() {}
}
"""),

        "module": Template("""import { Module } from '@nestjs/common';
import { ${module_class}Controller } from './${module_file_prefix}.controller';

@Module({
    controllers: [${module_class}Controller],
    providers: [],
    exports: [],
})
export class ${full_module_name} {}
"""),

        "input_dto": Template("""export class ${module_class}InputDto {}
"""),

        "output_dto": Template("""export class ${module_class}OutputDto {}
""")
    }

    # Context variables
    context = {
        "module_path": module_kebab.replace('-module', ''),  # for @Controller decorator
        "module_file_prefix": module_kebab,
        "module_class": module_class,
        "full_module_name": full_module_name
    }

    # Create files
    files = [
        (f"{module_kebab}.controller.ts", templates["controller"].substitute(context)),
        (f"{module_kebab}.module.ts", templates["module"].substitute(context)),
        (f"dtos/{module_kebab}.input.dto.ts", templates["input_dto"].substitute(context)),
        (f"dtos/{module_kebab}.output.dto.ts", templates["output_dto"].substitute(context))
    ]

    for filename, content in files:
        path = os.path.join(base_dir, filename)
        with open(path, "w") as f:
            f.write(content)
        print(f"Created: {path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create NestJS module structure")
    parser.add_argument("module_name", help="Full module name (e.g. PresentationModule)")
    args = parser.parse_args()
    
    create_nest_module(args.module_name)