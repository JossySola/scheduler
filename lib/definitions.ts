export type SignUpEmailData = {
    token: null;
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
        username?: string | null | undefined;
        displayUsername?: string | null | undefined; 
    }
} | {
    token: string;
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
        username?: string | null | undefined;
        displayUsername?: string | null | undefined; 
    };
}
export type SignInUsernameData = {
    token: string;
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
    } & {
        username: string;
        displayUsername: string;
    };
}
export type DeleteFormProps = {
    t: {
        warning: string,
        label: string,
        placeholder: string,
        button: string,
    }
}
export type ForgotFormProps = {
    t: {
        label: string,
        placeholder: string,
        description: string,
        button: string,
    }
}
export type ResetFormProps = {
    label: string,
    placeholder: string,
    button: string,
}
export type UpdateFormProps = {
    t: {
        labelCurrent: string,
        placeholderCurrent: string,
        labelNew: string,
        placeholderNew: string,
        button: string,
    }
}
export type AuthFormProps = {
    username?: string,
    name?: string,
    password?: string,   
    email?: string,
    placeholderEmail?: string, 
    placeholderName?: string,
    placeholderUsername?: string,
    placeholderPassword?: string,
    placeholderConfirm?: string,
    "pwd-description"?: string,
    "legal-description"?: string,
    signInBtn?: string,    
    signOutBtn?: string,
    signUpBtn?: string,
}
export type UnlinkProviderProps = {
    state: string,
    text: string,
    error: string,
    success: string,
}
// Table types
export type CellType = string;
export type RowType = Array<HeaderType | CellType>;
export type HeaderType = {
  value: string;
  type: "text" | "date" | "time";
  isVisible: boolean;
};
export type TableState = Array<RowType>;

export interface PanelInitialState {
    rows: TableState;
    hardConstraints: {
        disabledRows: Set<string>,
        disabledColumns: Set<string>,
    };
    softConstraints: {
        valuesInColumn: Map<string, Map<string, number>>,
        valuesInRow: Map<string, Set<string>>,
    };
    values: Set<string>;
}