"use client"
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
    Form, 
    FormControl, 
    FormField, 
    FormItem,  
    FormMessage
} from "@/components/ui/form"
import { registerSchema } from "../schemas";
import { useRegister } from "../api/use-register";
import { Mail, Lock, User } from "lucide-react";

export const SignUpCard = () => {
    const { mutate, isPending } = useRegister();
    
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    });

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        mutate({ json: values });
    }
        
    return(
        <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg px-4 sm:px-0">
            {/* Ambient glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-2xl blur-2xl opacity-30"></div>
            
            <Card className="relative w-full border-0 shadow-2xl bg-white rounded-2xl overflow-hidden">
                {/* Subtle top accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neutral-900 to-transparent"></div>
                
                <CardHeader className="space-y-1 px-6 sm:px-8 md:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8">
                    <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-neutral-500 text-sm sm:text-[15px] leading-relaxed">
                        By signing up, you agree to our{" "}
                        <Link href="/privacy" className="text-neutral-900 font-medium hover:underline underline-offset-2">
                            Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link href="/terms" className="text-neutral-900 font-medium hover:underline underline-offset-2">
                            Terms of Service
                        </Link>
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="px-6 sm:px-8 md:px-10 pb-8 sm:pb-10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                            <FormField 
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group">
                                                <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-[18px] sm:w-[18px] text-neutral-400 transition-colors group-focus-within:text-neutral-700" />
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Full name"
                                                    className="h-11 sm:h-12 pl-10 sm:pl-12 pr-4 bg-neutral-50/50 border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all duration-200 placeholder:text-neutral-400 text-sm sm:text-[15px]"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            
                            <FormField 
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-[18px] sm:w-[18px] text-neutral-400 transition-colors group-focus-within:text-neutral-700" />
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="Email address"
                                                    className="h-11 sm:h-12 pl-10 sm:pl-12 pr-4 bg-neutral-50/50 border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all duration-200 placeholder:text-neutral-400 text-sm sm:text-[15px]"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            
                            <FormField 
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-[18px] sm:w-[18px] text-neutral-400 transition-colors group-focus-within:text-neutral-700" />
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="Password"
                                                    className="h-11 sm:h-12 pl-10 sm:pl-12 pr-4 bg-neutral-50/50 border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all duration-200 placeholder:text-neutral-400 text-sm sm:text-[15px]"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            
                            <Button 
                                disabled={isPending} 
                                size="lg" 
                                className="w-full h-11 sm:h-12 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition-all duration-200 shadow-lg shadow-neutral-900/10 hover:shadow-xl hover:shadow-neutral-900/20 active:scale-[0.99] font-semibold text-sm sm:text-[15px]"
                            >
                                {isPending ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Creating account...
                                    </span>
                                ) : (
                                    "Create account"
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="relative my-6 sm:my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-neutral-200"></span>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-3 text-neutral-500 font-medium tracking-wide">OR</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <Button 
                            variant="outline"
                            disabled={isPending}
                            className="h-11 sm:h-12 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 rounded-xl transition-all duration-200 active:scale-[0.99] font-medium text-sm sm:text-[15px]"
                        >
                            <FcGoogle className="h-4 w-4 sm:h-5 sm:w-5"/>
                        </Button>
                        
                        <Button 
                            variant="outline"
                            disabled={isPending}
                            className="h-11 sm:h-12 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 rounded-xl transition-all duration-200 active:scale-[0.99] font-medium text-sm sm:text-[15px]"
                        >
                            <FaGithub className="h-4 w-4 sm:h-5 sm:w-5"/>
                        </Button>
                    </div>
                </CardContent>
                
                <div className="border-t border-neutral-100 bg-neutral-50/30 px-6 sm:px-8 md:px-10 py-5 sm:py-6">
                    <p className="text-center text-xs sm:text-sm text-neutral-600">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-neutral-900 font-semibold hover:underline underline-offset-4 decoration-2 transition-all duration-200">
                            Sign in
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};