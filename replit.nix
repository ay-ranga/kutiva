
{ pkgs }: {
  deps = [
    pkgs.python3
    pkgs.nodejs-18_x
    pkgs.nodePackages.http-server
    pkgs.curl
    pkgs.git
  ];
  
  env = {
    PYTHONPATH = "${pkgs.python3}/bin/python";
    NODE_PATH = "${pkgs.nodejs-18_x}/lib/node_modules";
  };
}
