import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.currentUser;
        console.log("this is the user", user);
        const roles = user && user.roles && Array.isArray(user.roles) ? user.roles.map(role => role.name) : [];
        console.log("this is roles user have", roles);
        if (roles.includes('admin')) return true;
        return false;
    }
}