// "use client";
// import Loader from "@/components/global/loader/Loader";
// import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/use-toast";
// // import { Input } from "@/components/ui/input";
// // import { Select } from "@/components/ui/select";
// import { baseURL } from "@/controller/api/config/baseUrl";
// import { profile } from "@/controller/api/constant/apiLink";
// import useAuth from "@/controller/hooks/useAuth";
// import { _profil } from "@/controller/tanstack/profil/getProfil.service";
// import _useUpdateProfile from "@/controller/tanstack/profil/useUpdateProfil";
// import { _province } from "@/controller/tanstack/province/getProvince.service";
// import { _roles } from "@/controller/tanstack/role/getRole.service";
// import { _territoire } from "@/controller/tanstack/territoire/getTerritoire.service";
// import { _village } from "@/controller/tanstack/village/getVillage.service";
// import { ChangepasswordCredentials, profileCredentials } from "@/types";
// import { Card, Col, Form, Input, Row, Select, Typography } from "antd";
// import axios from "axios";
// import { useState } from "react";
// import { useQuery } from "react-query";

// const { Option } = Select;

// const Home = () => {
//   const { token } = useAuth();
//   const { idUser } = useAuth();

//   const [idProvince, _setIdProvince] = useState("");
//   const [idTerritoire, _setIdTerritoire] = useState("");
//   const [isLoading, setIsLoading] = useState(false)
// const [isLoadingUpdateIngos ,setIsLoadingUpdateIngos] = useState(false)
//   const { data: dataProfil, refetch } = useQuery("auth-profil", () =>
//     _profil(token!, idUser)
//   );

//   const { data: dataRole } = useQuery(
//     "data-role",
//     () => _roles(token!)
//   );
//   const [credentials, setCredentials] = useState<profileCredentials>({
//     nom: "",
//     postnom: "",
//     prenom: "",
//     email: "",
//     phone: "",
//     adresse: "",
//     sexe: "",
//     idprovince: 0,
//     idterritoire: 0,
//     idvillage: 0,
//     role: [],

//   });

//   const [oldpassword, setOldpassword] = useState("")
//   const [newpassword, setNewpassword] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")

//   const [credentialspass, setCredentialsPass] = useState<ChangepasswordCredentials>({
//     oldpassword: oldpassword,
//     newpassword: newpassword,
//     confirmpassword: confirmPassword,
//   });

//   const { data: dataProvince } = useQuery("data-province", () => _province(token!));
//   const { data: dataTerritoire } = useQuery("auth-territoire", () => _territoire(token!, idProvince));
//   const { data: dataVillage } = useQuery("auth-village", () => _village(token!, idTerritoire));

//   const genreOptions = [
//     { label: "Genre", value: "" },
//     { label: "Masculin", value: "M" },
//     { label: "Féminin", value: "F" },
//   ];

//   if (!dataProfil || !dataProvince || !dataTerritoire || !dataVillage) {
//     return <p>Chargement...</p>;
//   }

//   const formatDate = (date: string) => {
//     if (!date) return "";
//     const d = new Date(date);
//     const month = `0${d.getMonth() + 1}`.slice(-2);
//     const day = `0${d.getDate()}`.slice(-2);
//     return `${d.getFullYear()}-${month}-${day}`;
//   };


//   // const [selectedProvinceId, setSelectedProvinceId] = useState<number | undefined>(undefined);
//   const handleProvinceChange = (value: number) => {
//     // setSelectedProvinceId(value);
//     setCredentials((prevCredentials) => ({
//       ...prevCredentials,
//       idprovince: value,
//     }));
//   };

//   // const [selectedTerritoirId, setSelectedTerritoirId] = useState<number | undefined>(undefined);

//   // console.log("Territoire : " + selectedTerritoirId);
//   const handleTerritoirChange = (value: number) => {
//     // setSelectedTerritoirId(value);
//     setCredentials((prevCredentials) => ({
//       ...prevCredentials,
//       idterritoire: value,
//     }));
//   }; 

//   const handleVillage = (value: number) => {
//     setCredentials((prevCredentials) => ({
//       ...prevCredentials,
//       idvillage: value,
//     }));
//   };

//   // const [selectedRoles, setSelectedRoles] = useState([]);

//   // const {
//   //   mutateAsync: _addProfile,
//   //   isLoading: loadAddIdentification,
//   // } = _useUpdateProfile();

//   // const handleSubmit = async (userId: number) => {
//   //   await _addProfile({
//   //     credentials1: {
//   //       nom: credentials?.nom,
//   //       postnom: credentials?.postnom,
//   //       prenom: credentials?.prenom,
//   //       phone: credentials.phone,
//   //       idroles: credentials?.idroles,
//   //       genre: credentials?.genre,
//   //       email: credentials?.email,
//   //       idprovince: credentials?.idprovince,
//   //       idterritoire: credentials?.idterritoire,
//   //       idvillage: credentials?.idvillage,
//   //       adresse: credentials?.adresse,
//   //     },
//   //     roleid: userId,
//   //     token: token!,
//   //   });
//   // };

//   const handleChangeUpdateInfos = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setCredentials((prevCredentials) => ({
//       ...prevCredentials,
//       [name]: value,
//     }));
//   };
//   const handleGenreChange = (value: string) => {

//     setCredentials((prevCredentials) => ({
//       ...prevCredentials,
//       sexe: value,
//     }));
//   };

//   const handleRoleChange = (value: number[]) => {

//     setCredentials((prevCredentials) => ({
//       ...prevCredentials,
//       role: value,
//     }));
//   };


//   const updateInfosUser = async (itemId:number) => {
//     const formData = new FormData();
//     formData.append('nom', credentials?.nom || '');
//     formData.append('postnom', credentials?.postnom || '');
//     formData.append('prenom', credentials?.prenom || '');
//     formData.append('email', credentials?.email || '');
//     formData.append('phone', credentials?.phone || '');
//     formData.append('genre', credentials?.sexe || '');
//     formData.append('adresse', credentials?.adresse || '');
//     formData.append('idprovince', credentials?.idprovince?.toString() || '');
//     formData.append('idterritoire', credentials?.idterritoire?.toString() || '');
//     formData.append('idvillage', credentials?.idvillage?.toString() || '');
//     formData.append('idroles', credentials?.role?.toString() || '');


//     setIsLoadingUpdateIngos(true)

//     if (credentials?.nom === '') {
//       toast({
//         description: `Le nouveau mot passe doit etre identique !`,
//       });
//     } else {
//       try {
//         const response = await axios.put(
//           baseURL + `${profile?.updateUserProfil(itemId)}`,
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               'x-ecommerce-kgreen-api': 'Bearer ' + token,
//             },
//           }
//         );
//         const json = response.data;
//         if (json.status == 200) {
//           toast({
//             description: `enregistré avec succes`,
//           });
//           setCredentialsPass({
//             ...credentialspass,
//             oldpassword: "",
//             newpassword: "",
//             confirmpassword: "",
//           });
//           refetch();
//         } else {
//           setIsLoadingUpdateIngos(false)
//           toast({
//             description: `${json.message}`,
//           });
//         }
//       } catch (error: any) {
//         if (axios.isAxiosError(error)) {
//           if (error.response) {
//             throw new Error(
//               error.response.data.message || "Erreur lors de l'enregistrement"
//             );
//           } else if (error.request) {
//             throw new Error(
//               "Le serveur n'a pas répondu. Veuillez réessayer plus tard."
//             );
//           }
//         }
//         throw new Error("Une erreur est survenue. Veuillez réessayer.");
//       }
//     }

//     setTimeout(() => {
//       setIsLoadingUpdateIngos(false);
//     }, 3000);
//   };

//   const handleOldPass = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const {value } = e.target;
//     setOldpassword(value);
//   };
//   const handleNewpassword = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const {  value } = e.target;
//     setNewpassword(value)
//   };
//   const handleConfirmpassword = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     setConfirmPassword(value);
//   };

//   const handleSubmitPassWord = async () => {
//     const formData = new FormData();
//     formData.append('newpassword', credentialspass?.newpassword || '');
//     formData.append('oldpassword', credentialspass?.oldpassword || '');

//     setIsLoading(true)

//     if (newpassword !== confirmPassword) {
//       toast({
//         description: `Le nouveau mot passe doit etre identique !`,
//       });
//       setIsLoading(false);
//     } else {
//       try {
//         const response = await axios.post(
//           baseURL + `${profile?.cnhagePassword}`,
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               'x-ecommerce-kgreen-api': 'Bearer ' + token,
//             },
//           }
//         );
//         const json = response.data;
//         if (json.status == 200) {
//           toast({
//             description: `enregistré avec succes`,
//           });
//           setCredentialsPass({
//             ...credentialspass,
//             oldpassword: "",
//             newpassword: "",
//             confirmpassword: "",
//           });
//           refetch();
//         } else {
//           setIsLoading(false)
//           toast({
//             description: `${json.message}`,
//           });
//         }
//       } catch (error: any) {
//         if (axios.isAxiosError(error)) {
//           if (error.response) {
//             throw new Error(
//               error.response.data.message || "Erreur lors de l'enregistrement"
//             );
//           } else if (error.request) {
//             throw new Error(
//               "Le serveur n'a pas répondu. Veuillez réessayer plus tard."
//             );
//           }
//         }
//         throw new Error("Une erreur est survenue. Veuillez réessayer.");
//       }
//     }

//     setTimeout(() => {
//       setIsLoading(false);
//     }, 3000);
//   };

//   return (
//     <div className="flex flex-col gap-12 w-full">
//       <div className=" flex justify-between items-center">
//         <div className=" flex gap-6 items-center">
//           <strong>Profile</strong>

//         </div>

//         {/* <Button >Retour al</Button> */}
//       </div>

//       <Card className="p-4 md:px-12 md:py-5">
//         <Row gutter={16} className="items-center">
//           <Col xs={24} md={8} className="flex justify-center mb-4 md:mb-0">
//             <img
//               width={200}
//               height={200}
//               src={`${baseURL}/${dataProfil?.data?.avatar}`}
//               alt="avatar"
//               className="h-48 w-48 md:h-96 md:w-96 rounded-full bg-gray-100 p-1"
//             />
//           </Col>
//           <Col xs={24} md={16}>
//             <Typography className="text-base font-semibold mb-8">
//               Modifier le profil
//             </Typography>
//             <Form
//               layout="vertical"
//               hideRequiredMark
//               initialValues={{
//                 nom: dataProfil?.data?.nom ?? "",
//                 postnom: dataProfil?.data?.postnom ?? "",
//                 prenom: dataProfil?.data?.prenom ?? "",
//                 email: dataProfil?.data?.email ?? "",
//                 sexe: dataProfil?.data?.sexe ?? "",
//                 phone: dataProfil?.data?.phone ?? "",
//                 idprovince: dataProfil?.data?.__tbl_ecom_province?.id ?? "",
//                 idterritoire: dataProfil?.data?.__tbl_ecom_territoire?.id ?? "",
//                 idvillage: dataProfil?.data?.__tbl_ecom_village?.id ?? "",
//                 date_naiss: formatDate(dataProfil?.data?.date_naiss),
//                 role: dataProfil?.data?.__tbl_ecom_roles?.map((role) => role.id) ?? [],
//               }}
//             >
//               <Row gutter={16}>
//                 <Col xs={24} md={8}>
//                   <Form.Item
//                     name="nom"
//                     label="Nom"
//                     rules={[{ required: true, message: "Entrez le nom" }]}
//                   >
//                     <Input placeholder="Entrez le nom de la coopérative" name="nom" 
//                     value={credentials.nom}
//                      onChange={handleChangeUpdateInfos}
//                     />
//                   </Form.Item>
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Form.Item
//                     name="postnom"
//                     label="Postnom"
//                     rules={[{ required: true, message: "Entrez le postnom" }]}
//                   >
//                     <Input placeholder="Entrez le postnom" name="postnom" 
//                     value={credentials.postnom}
//                      onChange={handleChangeUpdateInfos}
//                     />
//                   </Form.Item>
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Form.Item
//                     name="prenom"
//                     label="Prenom"
//                     rules={[{ required: true, message: "Entrez le prenom" }]}
//                   >
//                     <Input placeholder="Entrez le prenom" name="prenom" 
//                     value={credentials.prenom}
//                       onChange={handleChangeUpdateInfos}
//                     />
//                   </Form.Item>
//                 </Col>
//               </Row>
//               <Row gutter={16}>
//                 <Col xs={24} md={8}>
//                   <Form.Item
//                     name="email"
//                     label="Email"
//                     rules={[{ required: true, message: "Entrez l'adresse email" }]}
//                   >
//                     <Input placeholder="Entrez l'adresse email" name="email" 
//                     value={credentials.email}
//                      onChange={handleChangeUpdateInfos}
//                     />
//                   </Form.Item>
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Form.Item
//                     name="sexe"
//                     label="Genre"
//                     rules={[{ required: true, message: "Entrez le genre" }]}

//                   >
//                     <Select placeholder="Entrez le genre"
//                      onChange={handleGenreChange}
//                      value={credentials.sexe}
//                     >
//                       {genreOptions.map((option) => (
//                         <Option key={option.value} value={option.value}>
//                           {option.label}
//                         </Option>
//                       ))}
//                     </Select>
//                   </Form.Item>
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Form.Item
//                     name="phone"
//                     label="Tel"
//                     rules={[{ required: true, message: "Entrez le numéro de téléphone" }]}
//                   >
//                     <Input placeholder="Entrez le numéro de téléphone" name="phone"
//                     value={credentials.phone}
//                        onChange={handleChangeUpdateInfos}
//                     />
//                   </Form.Item>
//                 </Col>
//               </Row>
//               <Col span={12}>
//               <Form.Item label="Adresse">
//                 <Input
//                   name="adresse"
//                   value={credentials.adresse}
//                   onChange={handleChangeUpdateInfos}
//                 />
//               </Form.Item>
//             </Col>

//               <Row gutter={16}>
//                 <Col span={8}>
//                   <Form.Item
//                     // onFinish={() => onFinish}

//                     name="date_naiss"
//                     label="Date de naissance"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Entez la date de naissance",
//                       },
//                     ]}
//                   >
//                     <Input
//                       type="date"
//                       style={{ width: "100%" }}
//                       name="date_naiss"

//                     />
//                   </Form.Item>
//                 </Col>

//                 <Col xs={24} md={16}>
//                   <Form.Item
//                     name="role"
//                     label="Role" 
//                     rules={[{ required: true, message: "Role" }]}
//                   >
//                     <Select
//                       mode="tags"
//                       placeholder="Entrez le role"
//                       filterOption={(input: string, option: any) =>
//                         option.children
//                           .toLowerCase()
//                           .indexOf(input.toLowerCase()) >= 0
//                       }
//                     onChange={handleRoleChange}
//                     >
//                       {dataRole?.data?.rows?.map((item, i) => (
//                         <Option key={i} value={item.id}>{item.role}</Option>
//                       ))}
//                     </Select>

//                   </Form.Item>
//                 </Col>
//               </Row>
//               <Row gutter={16}>
//                 <Col xs={24} md={8}>
//                   <Form.Item
//                     name="idprovince"
//                     label="Province"
//                     rules={[{ required: true, message: "Entrez la province" }]}
//                   >
//                     <Select
//                       showSearch
//                       placeholder="Entrez la province"
//                       filterOption={(input: string, option: any) =>
//                         option.children
//                           .toLowerCase()
//                           .indexOf(input.toLowerCase()) >= 0
//                       }
//                     onChange={handleProvinceChange}
//                     >
//                       {dataProvince?.data?.rows?.map((item, i) => (
//                         <Option key={i} value={item.id}>{item.province}</Option>
//                       ))}
//                     </Select>

//                   </Form.Item>
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Form.Item
//                     name="idterritoire"
//                     label="Territoire"
//                     rules={[{ required: true, message: "Entrez le territoire" }]}
//                   >
//                     <Select
//                       placeholder="Entrez le territoire"
//                       onChange={handleTerritoirChange}
//                       showSearch
//                       filterOption={(input: string, option: any) =>
//                         option.children
//                           .toLowerCase()
//                           .indexOf(input.toLowerCase()) >= 0
//                       }
//                     >
//                       {
//                         credentials?.idprovince &&
//                         dataTerritoire?.data?.rows
//                           .filter(
//                             (item) => item.idprovince === credentials?.idprovince
//                           )
//                           .map((item, index) => (
//                             <Option key={index} value={item.id}>
//                               {item.territoire}
//                             </Option>
//                           ))}
//                     </Select>
//                   </Form.Item>
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <Form.Item
//                     name="idvillage"
//                     label="Village"
//                   >

//                     <Select
//                       placeholder="Entrez le village"
//                       showSearch
//                       filterOption={(input: string, option: any) =>
//                         option.children
//                           .toLowerCase()
//                           .indexOf(input.toLowerCase()) >= 0
//                       }
//                     onChange={handleVillage}
//                     >
//                       {
//                         credentials?.idterritoire &&
//                         dataVillage?.data?.rows
//                           .filter(
//                             (item) =>
//                               item.idterritoire === credentials?.idterritoire
//                           )
//                           .map((item, index) => (
//                             <Option key={index} value={item.id}>
//                               {item.village}
//                             </Option>
//                           ))}
//                     </Select>
//                   </Form.Item>
//                 </Col>
//               </Row>
//               <Row gutter={16} className="justify-end">
//                 <Col xs={24} md={8}>
//                   <Button className="w-full" onClick={()=>updateInfosUser(dataProfil?.data?.id)}>
//                     {isLoadingUpdateIngos ? <Loader /> : "Enregistrer les modifications"}
//                   </Button>
//                 </Col>
//               </Row>
//             </Form>
//           </Col>
//         </Row>
//         <Row gutter={16} className="items-center justify-end mt-12">
//           <Col xs={24} md={16}>
//             <Typography className="text-base font-semibold mb-8">
//               Modifier le mot de passe
//             </Typography>
//             <div

//             >
//               <Row gutter={16}>
//                 <Col xs={24} md={8}>
//                   <div

//                     // rules={[{ required: true, message: "Entrez l'ancien mot de passe" }]}
//                   >
//                     <label>Ancien mot de passe</label>
//                     <Input placeholder="Entrez l'ancien mot de passe" 
//                     name="oldpassword"
//                       onChange={handleOldPass}
//                     />
//                   </div>

//                 </Col>
//                 <Col xs={24} md={8}>
//                   <div
//                     // rules={[{ required: true, message: "Entrez le nouveau mot de passe" }]}
//                   >
//                     <label>Nouveau mot de passe</label>
//                     <Input placeholder="Entrez le nouveau mot de passe" 

//                       onChange={handleNewpassword}
//                     />
//                   </div>
//                 </Col>
//                 <Col xs={24} md={8}>
//                   <div
//                   >
//                     <label>Confirmer le mot de passe</label>
//                     <Input placeholder="Confirmez le mot de passe"
//                      name="confirmpassword" 
//                       onChange={handleConfirmpassword}
//                     />
//                   </div>
//                 </Col>
//               </Row>
//               <Row gutter={16} className="justify-end">
//                 <Col xs={24} md={8}>
//                   <Button className="w-full" onClick={handleSubmitPassWord}>
//                       {isLoading ? <Loader /> : "Changer le mot de passe"}
//                     </Button>
//                 </Col>
//               </Row>
//             </div>
//           </Col>
//         </Row>
//       </Card>
//     </div>

//   );
// };

// export default Home;

"use client";
import Loader from "@/components/global/loader/Loader";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { baseURL } from "@/controller/api/config/baseUrl";
import { profile } from "@/controller/api/constant/apiLink";
import useAuth from "@/controller/hooks/useAuth";
import { _profil } from "@/controller/tanstack/profil/getProfil.service";
import _useUpdateProfile from "@/controller/tanstack/profil/useUpdateProfil";
import { _province } from "@/controller/tanstack/province/getProvince.service";
import { _roles } from "@/controller/tanstack/role/getRole.service";
import { _territoire } from "@/controller/tanstack/territoire/getTerritoire.service";
import { _village } from "@/controller/tanstack/village/getVillage.service";
import { ChangepasswordCredentials, profileCredentials } from "@/types";
import { Card, Col, Form, Input, Row, Select, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { UploadOutlined } from '@ant-design/icons';
import Image from "next/image";

const { Option } = Select;

const Home = () => {
  const { token } = useAuth();
  const { idUser } = useAuth();

  const [idProvince, setIdProvince] = useState("");
  const [idTerritoire, setIdTerritoire] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUpdateInfos, setIsLoadingUpdateInfos] = useState(false);

  interface DatasProfile {
    nom: string;
    postnom: string;
    prenom: string;
    email: string;
    phone: string;
    adresse: string;
    sexe: string;
    idprovince: number;
    idterritoire: number;
    idvillage: number;
    role: number[];
  }

  interface Province {
    id: number;
    province: string;
  }

  interface Territoire {
    id: number;
    idprovince: number;
    territoire: string;
    __tbl_ecom_province: Province;
  }

  interface Village {
    id: number;
    idprovince: number;
    territoire: string;
    __tbl_ecom_province: Province;
  }

  interface Role {
    id: number;
    name: string;
  }

  interface ResponseData<T> {
    status: number;
    message: string;
    data: {
      count: number;
      rows: T[];
    };
  }

  const { data: dataProfil, refetch } = useQuery("auth-profil", () =>
    _profil(token!, idUser)
  );
  const { data: dataRole } = useQuery("data-role", () => _roles(token!));
  const [credentials, setCredentials] = useState<profileCredentials>({
    nom: "",
    postnom: "",
    prenom: "",
    email: "",
    phone: "",
    adresse: "",
    sexe: "",
    idprovince: 0,
    idterritoire: 0,
    idvillage: 0,
    role: [],
  });

  const [oldpassword, setOldpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUser, setAvatarUser] = useState("");

  const [credentialspass, setCredentialsPass] = useState<ChangepasswordCredentials>({
    oldpassword,
    newpassword,
    confirmpassword: confirmPassword,
  });

  const { data: dataProvince } = useQuery("data-province", () => _province(token!));
  const { data: dataTerritoire } = useQuery("auth-territoire", () => _territoire(token!, idProvince));
  const { data: dataVillage } = useQuery("auth-village", () => _village(token!, idTerritoire));

  const genreOptions = [
    { label: "Genre", value: "" },
    { label: "Masculin", value: "M" },
    { label: "Féminin", value: "F" },
  ];
  const [formIdentificationUpdate] = useForm<profileCredentials>()
  useEffect(() => {
    if (dataProfil && dataProfil.data) {
      const profil = dataProfil.data;
      
      setCredentials({
        nom: profil.nom || "",
        postnom: profil.postnom || "",
        prenom: profil.prenom || "",
        email: profil.email || "",
        phone: profil.phone || "",
        adresse: profil.adresse || "",
        sexe: profil.sexe || "",
        idprovince: profil.__tbl_ecom_province?.id || 0,
        idterritoire: profil.__tbl_ecom_territoire?.id || 0,
        idvillage: profil.__tbl_ecom_village?.id || 0,
        role: profil?.__tbl_ecom_roles?.map((role) => role.id) ?? [],
        
      });
      setAvatarUser(profil.avatar)
      // setIdProvince(profil.__tbl_ecom_province?.id.toString() || "");
      // setIdTerritoire(profil.__tbl_ecom_territoire?.id.toString() || "");
      formIdentificationUpdate.setFieldsValue({
        nom: profil.nom || "",
        postnom: profil.postnom || "",
        prenom: profil.prenom || "",
        email: profil.email || "",
        phone: profil.phone || "",
        adresse: profil.adresse || "",
        sexe: profil.sexe || "",
        idprovince: profil.__tbl_ecom_province?.id || 0,
        idterritoire: profil.__tbl_ecom_territoire?.id || 0,
        idvillage: profil.__tbl_ecom_village?.id || 0,
        role: profil?.__tbl_ecom_roles?.map((role) => role.id) ?? [],
        // role: profil?.__tbl_ecom_roles?.map((item: any) => item.id) as string[],
       
      });
    }
  }, [dataProfil, formIdentificationUpdate]);

  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const handleProvinceChange = (value: string) => {
    setIdProvince(value);
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      idprovince: parseInt(value, 10),
    }));
  };

  const handleTerritoirChange = (value: string) => {
    setIdTerritoire(value);
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      idterritoire: parseInt(value, 10),
    }));
  };

  const handleVillageChange = (value: number) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      idvillage: value,
    }));
  };

  const handleChangeUpdateInfos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleGenreChange = (value: string) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      sexe: value,
    }));
  };

  const handleRoleChange = (value: number[]) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      role: value,
    }));
  };

  const updateInfosUser = async (itemId: number) => {
    const formData = new FormData();
    formData.append('nom', credentials.nom || '');
    formData.append('postnom', credentials.postnom || '');
    formData.append('prenom', credentials.prenom || '');
    formData.append('email', credentials.email || '');
    formData.append('phone', credentials.phone || '');
    formData.append('genre', credentials.sexe || '');
    formData.append('adresse', credentials.adresse || '');
    formData.append('idprovince', credentials.idprovince?.toString() || '');
    formData.append('idterritoire', credentials.idterritoire?.toString() || '');
    formData.append('idvillage', credentials.idvillage?.toString() || '');
    formData.append('idroles', credentials.role?.toString() || '');

    setIsLoadingUpdateInfos(true);

    try {
      const response = await axios.put(
        `${baseURL}${profile?.updateUserProfil(itemId)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'x-ecommerce-kgreen-api': `Bearer ${token}`,
          },
        }
      );
      const json = response.data;
      if (json.status === 200) {
        toast({
          description: "Enregistré avec succès",
        });
        refetch();
      } else {
        toast({
          description: json.message,
        });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast({
            description: error.response.data.message || "Erreur lors de l'enregistrement",
          });
        } else if (error.request) {
          toast({
            description: "Le serveur n'a pas répondu. Veuillez réessayer plus tard.",
          });
        }
      } else {
        toast({
          description: "Une erreur est survenue. Veuillez réessayer.",
        });
      }
    } finally {
      setIsLoadingUpdateInfos(false);
    }
  };
 
 
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > 1024 * 1024) {
        
        toast({
          description: "Veuillez sélectionner un fichier de moins de 1 Mo.",
        });
      } else {
        const reader = new FileReader();
        reader.onload = async (e) => {
          setSelectedImage(e.target?.result as string);

          try {
            const formData = new FormData();
            formData.append("avatar", file);

            const response = await axios.put(`${baseURL}${profile?.updateAvatar}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                'x-ecommerce-kgreen-api': `Bearer ${token}`,
              },
            });

            if (response.data.status === 200) {
              toast({
                description: response.data.message,
              });
              refetch();
            } else {
              toast({
                description: response.data.message,
              });
            }
          } catch (error: any) {
            if (axios.isAxiosError(error)) {
              if (error.response) {
                toast({
                  description: error.response.data.message || "Erreur lors de l'enregistrement",
                });
              } else if (error.request) {
                toast({
                  description: "Le serveur n'a pas répondu. Veuillez réessayer plus tard.",
                });
              }
            } else {
              toast({
                description: "Une erreur est survenue. Veuillez réessayer.",
              });
            }
          } finally {
            setIsLoadingUpdateInfos(false);
          }
        };

        reader.readAsDataURL(file);
      }
    }
  };




  const handleOldPass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldpassword(e.target.value);
  };

  const handleNewpassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewpassword(e.target.value);
  };

  const handleConfirmpassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };


  const handleSubmitPassWord = async () => {
    const formData = new FormData();
    formData.append('newpassword', newpassword || '');
    formData.append('oldpassword', oldpassword || '');

    setIsLoading(true);

    if (newpassword !== confirmPassword) {
      toast({
        description: "Le nouveau mot de passe doit être identique !",
      });
    } else {
      try {
        const response = await axios.put(
          baseURL + `${profile?.cnhagePassword}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              'x-ecommerce-kgreen-api': 'Bearer ' + token,
            },
          }
        );
        const json = response.data;
        if (json.status == 200) {
          toast({
            description: json.message,
          });
          setCredentialsPass({
            oldpassword: "",
            newpassword: "",
            confirmpassword: "",
          });
          refetch();
        } else {
          setIsLoading(false)
          toast({
            description: `${json.message}`,
          });
        }
      } catch (error: any) {
        setIsLoading(false)
        if (axios.isAxiosError(error)) {
          if (error.response) {
            throw new Error(
              error.response.data.message || "Erreur lors de l'enregistrement"
            );
          } else if (error.request) {
            throw new Error(
              "Le serveur n'a pas répondu. Veuillez réessayer plus tard."
            );
          }
        }
        throw new Error("Une erreur est survenue. Veuillez réessayer.");
      }
    }

    // setTimeout(() => {
    //   setIsLoadingAddCoop(false);
    // }, 3000);
  };

  if (!dataProfil || !dataProvince || !dataTerritoire || !dataVillage) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-12 w-full">
      {/* <div className="flex justify-between items-center">
        <div className="text-base font-semibold mb-1">
          <Typography.Title level={4}>Profil</Typography.Title>
        </div>
      </div> */}

      <Card className="p-4 md:px-12 md:py-2">
      <Typography className="text-base font-semibold mb-8">
              Modifier le mot de passe
            </Typography>
        <Row gutter={16} className="items-center">
          <Col xs={24} md={8} className="flex justify-center mb-4 md:mb-0">
            
            <div className="relative">
              <Image
                width={200}
                height={200}
                src={selectedImage || `${baseURL}/${avatarUser}`}
                alt="avatar"
                className="h-48 w-48 md:h-96 md:w-96 rounded-full bg-gray-100 p-1"
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button className="absolute bottom-5 right-20 flex items-center" onClick={() => fileInputRef.current?.click()}>
                <UploadOutlined />
              </Button>
            </div>
          </Col>
          <Col xs={24} md={16}>=
            <Form layout="vertical" form={formIdentificationUpdate}>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label="Nom" name="nom">
                    <Input
                      placeholder="Nom"
                      value={credentials.nom}
                      onChange={handleChangeUpdateInfos}
                      name="nom"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Postnom" name="postnom">
                    <Input
                      placeholder="Postnom"
                      value={credentials.postnom}
                      onChange={handleChangeUpdateInfos}
                      name="postnom"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Prénom" name="prenom">
                    <Input
                      placeholder="Prénom"
                      value={credentials.prenom}
                      onChange={handleChangeUpdateInfos}
                      name="prenom"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Email" name="email">
                    <Input
                      placeholder="Email"
                      type="email"
                      value={credentials.email}
                      onChange={handleChangeUpdateInfos}
                      name="email"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Téléphone" name="phone">
                    <Input
                      placeholder="Téléphone"
                      type="tel"
                      value={credentials.phone}
                      onChange={handleChangeUpdateInfos}
                      name="phone"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Adresse" name="adresse">
                    <Input
                      placeholder="Adresse"
                      value={credentials.adresse}
                      onChange={handleChangeUpdateInfos}
                      name="adresse"
                    />
                  </Form.Item>c
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Genre" name="sexe">
                    <Select
                      value={credentials.sexe}
                      onChange={handleGenreChange}
                    >
                      {genreOptions.map((genre) => (
                        <Option key={genre.value} value={genre.value}>
                          {genre.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Province" name="idprovince">
                    <Select value={credentials.idprovince.toString()} onChange={handleProvinceChange}>
                      {dataProvince?.data.rows.map((province) => (
                        <Option key={province.id} value={credentials.idprovince}>
                          {province.province}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Territoire" name="idterritoire">
                    <Select value={credentials.idterritoire.toString()} onChange={handleTerritoirChange}>
                      {dataTerritoire?.data.rows
                        .filter(
                          (item) =>
                            item.id === credentials.idprovince
                        )
                        .map((territoire) => (
                          <Option key={territoire.id} value={credentials.idterritoire}>
                            {territoire.territoire}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Village" name="idvillage">
                    <Select value={credentials.idvillage} onChange={handleVillageChange}>
                      {dataVillage?.data.rows
                        .filter(
                          (item) =>
                            item.id === credentials.idterritoire
                        )
                        .map((village) => (
                          <Option key={village.id} value={village.id}>
                            {village.village}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Roles" name="role">
                    <Select mode="multiple" value={credentials.role} onChange={handleRoleChange}>
                      {dataRole?.data.rows.map((role: any) => (
                        <Option key={role.role} value={role.id}>
                          {role.role}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Button
                type="submit"
                onClick={() => updateInfosUser(idUser)}
              // loading={isLoadingUpdateInfos}
              >
                Mettre à jour les informations
              </Button>
            </Form>

          </Col>

        </Row>
      </Card>

      <Card className="p-4 md:px-12 md:py-5">
      <Typography className="text-base font-semibold mb-8">
              Modifier le mot de passe
            </Typography>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Ancien mot de passe" name="oldpassword">
                <Input.Password
                  placeholder="Ancien mot de passe"
                  value={oldpassword}
                  onChange={handleOldPass}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Nouveau mot de passe" name="newpassword">
                <Input.Password
                  placeholder="Nouveau mot de passe"
                  value={newpassword}
                  onChange={handleNewpassword}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Confirmer le mot de passe" name="confirmpassword">
                <Input.Password
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={handleConfirmpassword}
                />
              </Form.Item>
            </Col>
          </Row>
          <Button
            type="submit"
            onClick={handleSubmitPassWord}
          // loading={isLoading}
          >
            Mettre à jour le mot de passe
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Home;
