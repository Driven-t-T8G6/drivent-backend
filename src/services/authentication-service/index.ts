import sessionRepository from "@/repositories/session-repository";
import userRepository from "@/repositories/user-repository";
import { exclude } from "@/utils/prisma-utils";
import { User } from "@prisma/client";
import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { invalidCredentialsError } from "./errors";
import qs from "qs";

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, "password"),
    token,
  };
}

async function getGithubToken(code: String  ): Promise<String> {
  const params = {
    'client_id': '247b6bcb261263dac55e',
    'code': code,
    'client_secret': process.env.CLIENT_SECRET,
    'redirect_uri': 'http://localhost:3000/githubAuth',
    'grant_type': 'authorization_code'
  };
  
  const { data } = await axios.post('https://github.com/login/oauth/access_token', params, {headers: {'Content-Type': 'application/json'}});

  const parsedResponse = qs.parse(data);
  return parsedResponse.access_token as String;
}

async function fetchGithubUser(token: String) {
  try {
    
    const emails = await axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: "Bearer " + token
        }
    });
    
    const userEmail: string = emails.data[0].email;
    let user = await userRepository.findByEmail(userEmail);

    if(!user) 
      user = await userRepository.create({
        email: userEmail,
        password: "OAUTH_ONLY"
      });      

    const sessionToken = await createSession(user.id);
    return sessionToken;

  }
  catch(e) {
    console.log(e);
  }
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  if(userPassword === "OAUTH_ONLY")
    return invalidCredentialsError();
    
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

export type SignInParams = Pick<User, "email" | "password">;

type SignInResult = {
  user: Pick<User, "id" | "email">;
  token: string;
};

type GetUserOrFailResult = Pick<User, "id" | "email" | "password">;

const authenticationService = {
  signIn,
  getGithubToken,
  fetchGithubUser
};

export default authenticationService;
export * from "./errors";
