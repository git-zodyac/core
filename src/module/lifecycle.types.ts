export interface OnInit {
  onInit(): Promise<void> | void;
}

export interface OnReady {
  onReady(): Promise<void> | void;
}

export interface OnStart {
  onStart(): Promise<void> | void;
}

export interface OnStop {
  onStop(): Promise<void> | void;
}

export interface EmptyModule {}
