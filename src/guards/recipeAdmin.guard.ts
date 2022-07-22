import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class RecipeAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.currentUser;
        if (!user) return false;
        const roles = user && user.roles && Array.isArray(user.roles) ? user.roles.map(role => role.name) : [];
        console.log("roles for recipe is", roles);
        if (roles.includes('recipeAdmin')) return true;
        return false;
    }
}