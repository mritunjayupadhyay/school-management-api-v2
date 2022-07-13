import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class QuestionContributorGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.currentUser;
        if (!user) return false;
        const roles = user && user.roles && Array.isArray(user.roles) ? user.roles.map(role => role.name) : [];
        if (roles.includes('question_contributor') || roles.includes('admin')) return true;
        return false;
    }
}