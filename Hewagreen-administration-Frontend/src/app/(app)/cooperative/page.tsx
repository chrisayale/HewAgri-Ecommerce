"use client";
import { Button } from "@/components/ui/button";
import useAuth from "@/controller/hooks/useAuth";
import {
  _addCooperative,
  _cooperative,
} from "@/controller/tanstack/cooperative/getCooperative.service";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, List, Popconfirm, Table, Tag, Image, Modal } from "antd";
import { baseURL } from "@/controller/api/config/baseUrl";
import { EditIcon, ListCollapse, Trash2 } from "lucide-react";
import { _province } from "@/controller/tanstack/province/getProvince.service";
import { _territoire } from "@/controller/tanstack/territoire/getTerritoire.service";
import { _village } from "@/controller/tanstack/village/getVillage.service";
import { _identification } from "@/controller/tanstack/identification/getIdentification.service";
import { _categorieCooperative } from "@/controller/tanstack/categorieCooperative/getCategCooperative.service";
import { CooperativeCredentials } from "@/types";
import Loader from "@/components/global/loader/Loader";
import { Col, Drawer, Form, Input, Row, Select, Space } from "antd";
import useDeleteCoop from "@/controller/tanstack/cooperative/useDeleteCoop";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { toast, useToast } from "@/components/ui/use-toast";
import { cooperative } from "@/controller/api/constant/apiLink";
import FileModal from "@/components/ui/filemodal";
import { useForm } from 'antd/lib/form/Form';
import { generateCooperativePdf } from "@/components/docs/cooperativepdf";
import { FiPrinter } from "react-icons/fi";
import SpinLoader from "@/components/global/lazy/SpinLoader";
import { frenchFormattedDate } from "@/lib/dates";
import useAgriculteur from "@/controller/tanstack/agriculteurs/useAgriculteur";
import { generateAgriculteurMemberPdfparCooperative } from "@/components/docs/agriculteurpdf";

const { Option } = Select;


interface UserData {
  id: number,
  nom: string,
  postnom: string,
  prenom: string,
  phone: string,
  email: string,
  __tbl_ecom_hasmembers: {
    id: number,
    is_payed: number,
    carte: string,
    date_expiration: string,
    date_expiration_unix: string,
    TblEcomUserId: number,
    TblEcomCooperativeId: number,
    createdAt: string,
    updatedAt: string
  }
}
const Home = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [file, setFile] = useState('');
  const [saveFile, setSaveFile] = useState('')
  const [saveFichier, setSaveFichier] = useState<File | null>(null);
  const [image_default_name, setImageDefaultName] = useState('')
  const [image_default, setImageDefault] = useState('')
  const [isformel, setIsformel] = useState(0)
  const [isLoading, setIsLoadingAddCoop] = useState(false)
  const [nom, setNom] = useState('')
  const [sigle, setSigle] = useState('')
  const [description, setDescription] = useState('')
  const [idCategory, _setIdCategory] = useState('');
  const [idResponsable, setIdResponsable] = useState('');
  const [idAdjoint, setIdAdjoint] = useState('');
  const [idProvince, _setIdProvince] = useState('');
  const [idTerritoire, _setIdTerritoire] = useState('');
  const [adresse, setAdresse] = useState('')
  const [email, setEmail] = useState('')
  const [_numerEnreg, setNumerEnreg] = useState('')
  const [id, setId] = useState(Number)

  const { data: dataCooperative, isLoading: dataCooperativeLoad, refetch } = useQuery(
    "auth-profil",
    () => _cooperative(token!)
  );

  const { data: dataProvince } = useQuery(
    "auth-province",
    () => _province(token!)
  );
  const { data: dataTerritoire } = useQuery(
    "auth-territoire",
    () => _territoire(token!, idProvince)
  );
  const { data: dataVillage, } = useQuery(
    "auth-village",
    () => _village(token!, idTerritoire)
  );

  const { data: dataIdentification } =
    useQuery("auth-procoop", () => _identification(token!));

  const { data: dataCategCooperative } = useQuery("auth-categpr", () =>
    _categorieCooperative(token!)
  );

  const {
    mutateAsync: _deleteCooperative
  } = useDeleteCoop();

  const [credentials, setCredentials] = useState<CooperativeCredentials>({
    sigle: "",
    cooperative: "",
    description: "",
    phone: "",
    email: "",
    isformel: 0,
    id_category: "",
    id_responsable: "",
    id_adjoint: "",
    id_province: 0,
    id_territoire: 0,
    id_village: 0,
    file: null,
    adresse: "",
    logo: "",
    editMode: false
  });

  const [phone, setPhone] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('sigle', credentials?.sigle || '');
    formData.append('cooperative', credentials?.cooperative || '');
    formData.append('description', credentials?.description || '');
    formData.append('phone', credentials?.phone || '');
    formData.append('email', credentials?.email || '');
    formData.append('isformel', credentials?.isformel?.toString() || '');
    formData.append('id_category', credentials?.id_category || '');
    formData.append('id_responsable', credentials?.id_responsable || '');
    formData.append('id_adjoint', credentials?.id_adjoint || '');
    formData.append('id_province', credentials?.id_province?.toString() || '');
    formData.append('id_territoire', credentials?.id_territoire?.toString() || '');
    formData.append('id_village', credentials?.id_village?.toString() || '');
    if (saveFichier) {
      formData.append('file', saveFichier);
    }
    // formData.append('file', saveFichier);
    formData.append('logo', saveFile)
    formData.append('adresse', credentials?.adresse || '');

    setIsLoadingAddCoop(true)

    if (credentials?.cooperative === '') {
      toast({
        description: `Assurer vous d'avoir completez tout les champs requis !`,
      });
    } else {
      try {
        const response = await axios.post(
          baseURL + `${cooperative?.addCooperative}`,
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
            description: `enregistré avec succes`,
          });
          setCredentials({
            ...credentials,
            sigle: "",
            cooperative: "",
            description: "",
            phone: "",
            isformel: 0,
            id_category: "",
            id_responsable: "",
            id_adjoint: "",
            id_province: 0,
            id_territoire: 0,
            file: null,
            adresse: "",
            logo: "",
          });

          refetch();
          setOpen(false);
        } else {
          setIsLoadingAddCoop(false)
          toast({
            description: `${json.message}`,
          });
        }
      } catch (error: any) {
        setIsLoadingAddCoop(false);
        let errorMessage = "Erreur lors de l'ajout de la coopérative";

        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
            const responseData = error.response.data as {
              message?: string;
              data?: { msg?: string }[];
            };
            if (responseData.message) {
              errorMessage = responseData.message;
            } else if (responseData.data && responseData.data.length > 0) {
              const errorMessages = responseData.data.map((error) => error.msg).join(", ");
              errorMessage = errorMessages;
            }
          } else if (error.message) {
            errorMessage = error.message;
          }
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
          errorMessage = error.message;
        }
        toast({
          variant: "destructive",
          description: errorMessage
        })
      }
    }

  };

  const handleUpdateCooperative = async () => {
    const formData = new FormData();
    formData.append('sigle', sigle);
    formData.append('cooperative', nom);
    formData.append('description', description);
    formData.append('phone', phone);
    formData.append('email', credentials?.email || '');
    formData.append('isformel', isformel.toString());
    formData.append('id_category', idCategory);
    formData.append('id_responsable', idResponsable);
    formData.append('id_adjoint', idAdjoint);
    formData.append('id_province', credentials?.id_province?.toString() || '');
    formData.append('id_territoire', credentials?.id_territoire?.toString() || '');
    formData.append('id_village', credentials?.id_village?.toString() || '');
    if (saveFichier) {
      formData.append('file', saveFichier);
      // Vous pouvez maintenant envoyer formData via une requête HTTP
    }
    // formData.append('file', saveFichier);
    formData.append('logo', saveFile)
    formData.append('adresse', adresse);

    setIsLoadingAddCoop(true)

    if (nom === '') {
      toast({
        description: `Assurer vous d'avoir completez tout les champs requis !`,
      });
    } else {
      try {
        const response = await axios.put(
          baseURL + `${cooperative?.updateCooperative(id)}`,
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
            description: `enregistré avec succes`,
          });
          setCredentials({
            ...credentials,
            sigle: "",
            cooperative: "",
            description: "",
            phone: "",
            isformel: 0,
            id_category: "",
            id_responsable: "",
            id_adjoint: "",
            id_province: 0,
            id_territoire: 0,
            file: null,
            adresse: "",
            logo: "",
          });
          refetch();
        } else {
          setIsLoadingAddCoop(false)
          toast({
            description: `${json.message}`,
          });
        }
      } catch (error: any) {
        setIsLoadingAddCoop(false)
        let errorMessage = "Erreur lors de la modification de la coopérative";

        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
            const responseData = error.response.data as {
              message?: string;
              data?: { msg?: string }[];
            };
            if (responseData.message) {
              errorMessage = responseData.message;
            } else if (responseData.data && responseData.data.length > 0) {
              const errorMessages = responseData.data.map((error) => error.msg).join(", ");
              errorMessage = errorMessages;
            }
          } else if (error.message) {
            errorMessage = error.message;
          }
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
          errorMessage = error.message;
        }
        toast({
          variant: "destructive",
          description: errorMessage
        })
      }
    }

  };

  const rows = dataIdentification?.data?.rows;
  //add drawer

  const [openAgri, setOpenAgri] = useState(false);
  const [openModif, setOpenModif] = useState(false);
  const showDrawerAgri = () => {
    setOpenAgri(true);
  };



  const [selectedProvinceId, setSelectedProvinceId] = useState<
    number | undefined
  >();

  const handleProvinceChange = (value: number) => {
    setSelectedProvinceId(value);
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      id_province: value,
    }));
  };
  const [selectedTerritoirId, setSelectedTerritoirId] = useState<
    number | undefined
  >();

  const handleTerritoirChange = (value: number) => {
    setSelectedTerritoirId(value);
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      id_territoire: value,
    }));
  };

  const [selectVillageId, setSelectVillageId] = useState<number | undefined>()
  const handleVillage = (value: number) => {
    setSelectVillageId(value)
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      idvillage: value,
    }));
  };

  const handleRespoChange = (value: string) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      id_responsable: value,
    }));
  };
  const handleAdjointChange = (value: string) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      id_adjoint: value,
    }));
  };

  const handleFormalChange = (value: number) => {
    setIsformel(value)
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      isformel: value,
    }));
  };

  const handleCategorieChange = (value: any) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      id_category: value,
    }));
  };

  const options = [
    { value: 1, label: "Formel" },
    { value: 0, label: "Non Formel" },
  ];
  // delete
  const handleDelete = async (id: number) => {
    await _deleteCooperative({ useid: id, token: token! });
  };

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    setImageDefault(URL.createObjectURL(file));
    setSaveFile(event.target.files[0]);
  };
  // const handleFichierUpload = (event: any) => {
  //   setSaveFichier(event.target.files[0]);
  // };
  // const handleFichierUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const uploadedFile = event.target.files?.[0];
  //   if (uploadedFile) {
  //     if (uploadedFile.type === 'application/pdf') {
  //       setSaveFichier(uploadedFile.name);
  //     } else {
  //       toast({
  //         description: "Veuillez télécharger un fichier PDF.",
  //       });
  //       setSaveFichier(''); 
  //     }
  //   }
  // };

  const handleFichierUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.type === 'application/pdf') {
        setSaveFichier(uploadedFile); // Stocke l'objet File
      } else {
        toast({
          description: "Veuillez télécharger un fichier PDF.",
        });
        setSaveFichier(null); // Réinitialise le fichier
      }
    }
  };

  const [searchedText, setSearchedText] = useState<string>("");
  const filteredData = dataCooperative?.data?.rows?.filter(
    (item: any): boolean => {
      return Object.keys(item).some((key: string) =>
        item[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
      );
    }
  );

  const [showDialogMembre, setShowDialogMembre] = useState(false)
  const [title, setTitle] = useState("")

  const handleOpenFile = (file: any, item: any) => {
    setIsModalOpen1(true);
    setFile(file)
    setTitle(item)
  }

  const [loarUser, setLoadUser] = useState<UserData[]>([])
  const [coop, setCoop] = useState("")
  const [cooperativeId, setCooperativeId] = useState("")
  const showDialog = (element: any) => {
    setShowDialogMembre(true)
    setLoadUser(element?.__tbl_ecom_users)
    setCoop(element?.cooperative)
    setCooperativeId(element?.id)

  }
  const handleOk = () => {
    setIsModalOpen1(false);
    setShowDialogMembre(false)
  };

  const handleCancel1 = () => {
    setIsModalOpen1(false);
    setShowDialogMembre(false)
  };
  const handleOk1 = () => {
    setShowDialogMembre(false)
  };

  const handleCancel2 = () => {
    setShowDialogMembre(false)
  };

  const [formCooperative] = useForm<CooperativeCredentials>()


  const showDrawerModif = (element: any) => {
    setNom(element?.cooperative);
    setSigle(element?.sigle);
    setIdResponsable(element?.id_responsable);
    setIdAdjoint(element?.id_adjoint);
    setDescription(element?.description);
    setEmail(element?.email);
    setPhone(element?.phone);
    setNumerEnreg(element?.num_enregistrement);
    setId(element?.id);
    setIsformel(element?.isformel);
    if (element?.logo && typeof element.logo === 'string') {
      setImageDefaultName(baseURL + '/' + element?.logo);
    }
    setAdresse(element?.adresse);
    handleCategorieChange(element?.id_category);
    handleProvinceChange(element?.id_province);
    handleTerritoirChange(element?.id_territoire);
    handleVillage(element?.id_village);

    formCooperative.setFieldsValue({
      cooperative: element?.cooperative,
      sigle: element?.sigle,
      id_responsable: element?.id_responsable,
      id_adjoint: element?.id_adjoint,
      email: element?.email,
      phone: element?.phone,
      description: element?.description,
      adresse: element?.adresse,
      isformel: element?.isformel,
      id_category: element?.id_category,
      id_province: element?.id_province,
      id_territoire: element?.id_territoire,
      logo: element?.logo,
    });

    setOpenModif(true);
  };


  // const { data: dataIdentification } =
  //   useQuery("data-identification", () => _identification(token!));

  // const { data: dataCooperative } = useQuery("auth-coop", () =>
  //   _cooperative(token!)
  // );

  // const [credentialsagri, setCredentialsAgri] = useState<AgriculteurCredentials>({
  //   ids_members: [],
  //   id_cooperative: ""
  // })


  const { mutateAsync: _addAgriculteur, isLoading: loadAddAgri, error } = useAgriculteur()

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const [selectedMembre, setSelectedMembre] = useState<[]>([]);

  const handleSubmitMembre = async () => {
    try {
      await _addAgriculteur({
        credentials: {
          ids_members: selectedMembre,
          id_cooperative: cooperativeId,
        },
        token: token!,
      });
      refetch();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'agriculteur :", error);
    }
  };
  const handleMembreChange = (value: any) => {
    setSelectedMembre(value)
  };

  // const handleCoopChange = (value: string) => {
  //   setCredentials((prevCredentials) => ({
  //     ...prevCredentials,
  //     id_cooperative: value,
  //   }));
  // };

  const [searchedTextAgri, setSearchedTextAgri] = useState<string>("");

  const filteredDataAgri = loarUser?.filter(
    (item: any): boolean => {
      return Object.keys(item).some((key: string) =>
        item[key]?.toString().toLowerCase().includes(searchedTextAgri.toLowerCase())
      );
    }
  );


  const onClose = () => {
    setOpenAgri(false);
    setOpenModif(false);
    setOpen(false);
  };

  return (
    <div>
      <LayoutCompWithTable
        title="Liste de coopératives"
        btn={
          <>
            <>

              <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
                <Input.Search
                  placeholder="Rechercher une cooperative"
                  className="placeholder:!text-xs"
                  onSearch={(v) => setSearchedText(v)}
                  onChange={(e) => setSearchedText(e.target.value)}
                />
                <Button onClick={showDrawer}>Ajouter Une coopérative</Button>
                <Button onClick={() => generateCooperativePdf('Liste des cooperatives', filteredData)}><FiPrinter />Imprimer</Button>
              </div>
              <Drawer
                title="Ajouter Une coopérative"
                width={720}
                onClose={onClose}
                open={open}
                maskClosable={false}
                styles={{
                  body: {
                    paddingBottom: 80,
                  },
                }}
                extra={
                  <Space>
                    {/* <Button onClick={onClose}>Cancel</Button> */}
                    <Button onClick={handleSubmit}>
                      {isLoading ? <Loader /> : "Enregistrer"}
                    </Button>
                  </Space>
                }
              >
                <Form layout="vertical" hideRequiredMark>
                  <Row gutter={16}>
                    <Col span={12}>
                      <label><span className="text-red-600">*</span>Coopérative</label>
                      <Form.Item
                        name="cooperative"
                        // label="Coopérative"
                        rules={[
                          {
                            required: true,
                            message: "Enter le nom de la coopérative",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Enter le nom de la coopérative"
                          name="cooperative"
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="sigle"
                        label="En sigle"
                        rules={[{ required: true, message: "En sigle" }]}
                      >
                        <Input
                          style={{ width: "100%" }}
                          placeholder="Entrer le sigle de la coopérative"
                          name="sigle"
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>

                    <Col span={12}>
                      <label><span className="text-red-600">*</span>Responsable</label>
                      <Form.Item
                        name="id_responsable"
                        // label="Responsable"
                        rules={[
                          {
                            required: true,
                            message: "Entrez le responsable",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Entrez le responsable"
                          onChange={handleRespoChange}
                        >
                          {dataIdentification?.data?.rows.map((item, i) =>
                            item.__tbl_ecom_roles?.map((el) => {
                              if (el.role === "Responsable") {
                                return (
                                  <Option
                                    key={i}
                                    value={item.id}
                                  >{`${item.nom} ${item.postnom}`}</Option>
                                );
                              }
                            })
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <label><span className="text-red-600">*</span>Responsable Adjoint</label>
                      <Form.Item
                        name="id_adjoint"
                        // label="Responsable Adjoint"
                        rules={[
                          {
                            required: true,
                            message: "Entrez le responsable adjoint",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Entrez le responsable adjoint"
                          onChange={handleAdjointChange}
                        >
                          {dataIdentification?.data?.rows.map((item, i) =>
                            item.__tbl_ecom_roles?.map((el) => {
                              if (el.role === "Responsable Adjoint") {
                                return (
                                  <Option
                                    key={i}
                                    value={item.id}
                                  >{`${item.nom} ${item.postnom}`}</Option>
                                );
                              }
                            })
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          {
                            required: true,
                            message: "Entrez l'adresse email",
                          },
                        ]}
                      >
                        <Input
                          style={{ width: "100%" }}
                          placeholder="Entrez l'adresse email"
                          name="email"
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <label><span className="text-red-600">*</span>Téléphone</label>
                      <Form.Item
                        name="phone"
                        // label="Téléphone"
                        rules={[
                          {
                            required: true,
                            message: "Entez le numero de téléphone",
                          },
                        ]}
                      >
                        {/* <PhoneInput
                          inputStyle={{
                            width: '100%',
                            color: 'black'
                          } as React.CSSProperties}
                          inputClass={'form-control'}
                          country={'cd'}
                          value={phone}
                          onChange={changePhoneNumber}
                          enableSearch={true}
                          countryCodeEditable={true}
                          autoFormat={false}
                        /> */}

                        <Input
                          style={{ width: "100%" }}
                          placeholder="Entez le numero de téléphone"
                          name="phone"
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    {/* <Col span={12}>
                      <Form.Item
                        name="gender"
                        label="Num. Enregistrement"
                        rules={[
                          {
                            required: true,
                            message: "Entrez le genre",
                          },
                        ]}
                      >
                        <Input
                          style={{ width: "100%" }}
                          placeholder="Entrez le genre"
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </Col> */}

                    <Col span={12}>
                      <label><span className="text-red-600">*</span>Formalisation</label>
                      <Form.Item
                        name="isformel"
                        // label="Formalisation"
                        rules={[
                          {
                            required: true,
                            message: "Entrez la formalisation",
                          },
                        ]}
                      >
                        <Select
                          style={{ width: "100%" }}
                          // value={isformel}
                          onChange={handleFormalChange}
                        >
                          <Option value="">Formalisation</Option>
                          {options.map((option) => (
                            <Option key={option.value} value={option.value}>
                              {option.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <label><span className="text-red-600">*</span>Categorie</label>
                      <Form.Item
                        name="id_category"
                        // label="Categorie"
                        rules={[
                          {
                            required: true,
                            message: "Entrez la categirie",
                          },
                        ]}
                      >
                        <Select
                          style={{ width: "100%" }}
                          // value={isformel}
                          onChange={handleCategorieChange}
                        >
                          <Option value="">Categorie</Option>
                          {dataCategCooperative?.data.rows.map((option, i) => (
                            <Option key={i} value={option?.id}>
                              {option?.category}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>

                    {
                      isformel == 1 &&
                      <Col span={12}>
                        <Form.Item
                          name="file"
                          label="Attacher le fichier"
                          rules={[
                            {
                              required: true,
                              message: "Attacher le fichier",
                            },
                          ]}
                        >
                          <Input
                            type="file"
                            style={{ width: "100%" }}
                            placeholder="Attacher le fichier"
                            name="file"
                              accept="application/pdf"
                            onChange={handleFichierUpload}
                          />
                        </Form.Item>
                      </Col>
                    }

                    <Col span={12}>
                      <label><span className="text-red-600">*</span>Province</label>
                      <Form.Item
                        name="id_province"
                        // label="Province"
                        rules={[
                          {
                            required: true,
                            message: "Entrez le province ",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Entrez le province"
                          onChange={handleProvinceChange}
                          showSearch
                          filterOption={(input: string, option: any) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {dataProvince?.data?.rows?.map((item, i) => (
                            <Option
                              key={i}
                              value={item.id}
                            >{`${item.province}`}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>


                  </Row>
                  <Row gutter={16}>

                    <Col span={12}>
                      <label><span className="text-red-600">*</span>Territoire</label>
                      <Form.Item
                        name="id_territoire"
                        // label="Territoire"
                        rules={[
                          {
                            required: true,
                            message: "Entrez le territoire ",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Entrez le territoire"
                          onChange={handleTerritoirChange}
                          showSearch
                          filterOption={(input: string, option: any) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {selectedProvinceId &&
                            dataTerritoire?.data?.rows
                              .filter(
                                (item) => item.idprovince === selectedProvinceId
                              )
                              .map((item, index) => (
                                <Option key={index} value={item.id}>
                                  {item.territoire}
                                </Option>
                              ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>

                      <Form.Item
                        name="village"
                        label="Village"
                        rules={[
                          {
                            required: true,
                            message: "Entrez le village ",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Entrez le village"
                          onChange={handleVillage}
                          showSearch
                          filterOption={(input: string, option: any) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {selectedTerritoirId &&
                            dataVillage?.data?.rows
                              .filter(
                                (item) =>
                                  item.idterritoire === selectedTerritoirId
                              )
                              .map((item, index) => (
                                <Option key={index} value={item.id}>
                                  {item.village}
                                </Option>
                              ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="logo"
                        label="Logo"
                        rules={[
                          {
                            required: true,
                            message: "Entrez le logo",
                          },
                        ]}
                      >
                        <div className="col" style={{ marginTop: 15 }}>
                          <Image
                            className='form-control'
                            src={image_default || image_default_name}
                            style={{ width: 150 }}
                            alt=""
                          />
                          <br />
                          <label className={'badge bg-primary'} style={{ color: 'white' }}>
                            Attacher le logo
                            <input type='file' style={{ display: 'none' }} onChange={handleImageUpload} />
                          </label>
                        </div>
                      </Form.Item>
                    </Col>

                  </Row>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                          {
                            required: true,
                            message: "Entrez la description",
                          },
                        ]}
                      >
                        <Input
                          style={{ width: "100%" }}
                          placeholder="Entrez la description"
                          name="description"
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="adresse"
                        label="Adresse"
                        rules={[
                          {
                            required: true,
                            message: "Entrez l'adresse ",
                          },
                        ]}
                      >
                        <Input
                          style={{ width: "100%" }}
                          placeholder="Entrez l'adresse"
                          name="adresse"
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Drawer>
            </>
          </>
        }
        content={
          <div>
            {
              dataCooperativeLoad ? (
                <SpinLoader />
              ) : (
                <>
                  <Table
                    dataSource={filteredData}
                    loading={dataCooperativeLoad}
                    className=" h-[70vh] overflow-auto"
                    columns={[
                      {
                        title: "N°",
                        dataIndex: "index",
                        key: "index",
                        render: (_, __, index) => index + 1,
                        width: "3rem",
                      },
                      {
                        title: "Nom complet",
                        dataIndex: "name",
                        key: "name",
                        render: (_, item, _index) => (
                          <>
                            <List.Item.Meta
                              className=" flex items-center gap-4"
                              avatar={<Avatar src={`${baseURL}/${item?.logo}`} />}
                              title={<strong>{`${item?.cooperative}`}</strong>}
                              description={item?.sigle}
                            />
                          </>
                        ),
                      },
                      {
                        title: "Tel",
                        dataIndex: "tel",
                        key: "tel",
                        render: (_, item, _index) => <a>{item?.phone}</a>,
                      },
                      {
                        title: "Description",
                        dataIndex: "descrip",
                        key: "descrip",

                        render: (_, item, _index) => <a>{item.description}</a>,
                      },
                      {
                        title: "Modifier",
                        key: "update",
                        dataIndex: "update",
                        align: "center",
                        render: (_, item, _index) => (
                          <>
                            <Tag onClick={() => showDrawerModif(item)} color="green" className=" p-2 cursor-pointer">
                              <EditIcon size={16} />
                            </Tag>

                          </>
                        ),
                      },
                      {
                        title: "Supprimer",
                        key: "delete",
                        align: "center",
                        render: (_, item, _index) => (
                          <>
                            <Popconfirm
                              placement="bottom"
                              title="Suppression utilisateur"
                              description="Voulez-vous vraiment supprimer cette coopérative"
                              okText="Supprimer"
                              cancelText="NON"
                              onConfirm={() => handleDelete(item?.id)}
                            >
                              <Tag color="volcano" className=" p-2 cursor-pointer">
                                <Trash2 size={16} />
                              </Tag>
                            </Popconfirm>
                          </>
                        ),
                      },
                      {
                        title: "Détail",
                        key: "datail",
                        align: "center",
                        render: (_, item, _index) => (
                          <>
                            <Sheet >
                              <SheetTrigger>
                                <Tag color="green" className=" p-2 cursor-pointer">
                                  <ListCollapse size={16} />
                                </Tag>
                              </SheetTrigger>
                              <SheetContent className="w-[900px] md:w-full md:max-w-2xl lg:max-w-3xl"
                              >
                                <SheetHeader>
                                  <SheetTitle>Détail du coopérative</SheetTitle>
                                  <SheetDescription>
                                    <div className=" w-full py-6 px-2 flex flex-col gap-8  ">
                                      <div className=" w-full flex justify-center">
                                        <Avatar
                                          src={`${baseURL}/${item?.logo}`}
                                          className=" w-20 h-20"
                                        />
                                      </div>

                                      <div>
                                        <div className="">
                                          <div className="h-[60vh] overflow-auto border-t border-gray-200  py-5 sm:p-0">
                                            <dl className="sm:divide-y sm:divide-gray-200">
                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500">
                                                  Cooperative
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                  <strong>
                                                    {`${item?.cooperative}`}
                                                  </strong>
                                                  <small className="pl-2">{`${item?.sigle}`}</small>
                                                </dd>
                                              </div>
                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500">
                                                  Email
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                  {item?.email}
                                                </dd>
                                              </div>
                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500">
                                                  Tel
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                  {item?.phone}
                                                </dd>
                                              </div>
                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500 whitespace-nowrap">
                                                  Nuremo d&apos;enreg
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                  {item?.num_enregistrement}
                                                </dd>
                                              </div>

                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500">
                                                  Formalisation
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                  {item?.isformel == 1
                                                    ? "Formel"
                                                    : "Nom Formel"}
                                                </dd>
                                              </div>

                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500">
                                                  Membres
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                  {item?.__tbl_ecom_users?.length}
                                                </dd>
                                              </div>

                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500">
                                                  Province
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                  {
                                                    dataProvince?.data?.rows?.find(
                                                      (el) => (el.id = item.id_province)
                                                    )?.province
                                                  }
                                                </dd>
                                              </div>
                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500">
                                                  Territoire
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                  {
                                                    dataTerritoire?.data?.rows?.find(
                                                      (el) =>
                                                        (el.id = item.id_territoire)
                                                    )?.territoire
                                                  }
                                                </dd>
                                              </div>

                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500">
                                                  Responsable
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                  {
                                                    rows?.find(
                                                      (el) =>
                                                        (el.id = item?.id_responsable)
                                                    )?.nom
                                                  }
                                                  <br />
                                                  {
                                                    rows?.find(
                                                      (el) =>
                                                        (el.id = item?.id_responsable)
                                                    )?.phone
                                                  }
                                                </dd>
                                              </div>
                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500">
                                                  Adjoint
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                  {
                                                    rows?.find(
                                                      (el) => el.id === item?.id_adjoint
                                                    )?.nom
                                                  }
                                                  <br />
                                                  {
                                                    rows?.find(
                                                      (el) => el.id === item?.id_adjoint
                                                    )?.phone
                                                  }
                                                </dd>
                                              </div>

                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500">
                                                  Catégorie
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                  {
                                                    dataCategCooperative?.data?.rows?.find(
                                                      (el) =>
                                                        (el.id = item?.id_category)
                                                    )?.category
                                                  }
                                                </dd>
                                              </div>

                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500">
                                                  Document
                                                </dt>
                                                <dd onClick={() => handleOpenFile(item.file, item?.cooperative)} className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 cursor-pointer">
                                                  <Tag color="green" className=" p-1 w-[50%] flex justify-center">
                                                    Fichier PDF
                                                  </Tag>
                                                </dd>
                                              </div>

                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500">
                                                  Membre
                                                </dt>
                                                <dd onClick={() => showDialog(item)} className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 cursor-pointer">
                                                  <Tag color="cyan" className=" p-1 w-[50%] flex justify-center">
                                                    Liste des membres
                                                  </Tag>
                                                </dd>
                                              </div>

                                            </dl>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </SheetDescription>
                                </SheetHeader>
                              </SheetContent>
                            </Sheet>
                          </>
                        ),
                      },
                    ]}
                  />
                </>
              )
            }
          </div>

        }
      />

      <Drawer
        maskClosable={false}
        title="Modifier la Coopérative"
        width={720}
        onClose={onClose}
        open={openModif}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>

            <Button onClick={() => handleUpdateCooperative()}>
              {isLoading ? <Loader /> : "Modifier"}
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" hideRequiredMark form={formCooperative}
        // initialValues={
        //   {
        //     cooperative: nom,
        //     sigle: sigle,
        //     id_responsable: idResponsable,
        //     id_adjoint: idAdjoint,
        //     email: email,
        //     phone: phone,
        //     description: description,
        //     adresse: adresse,
        //     isformel: isformel,
        //     id_category: idCategory,
        //     id_province: selectedProvinceId,
        //     id_territoire: selectedTerritoirId,
        //     logo: image_default_name
        //   }
        // }
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cooperative"
                label="Coopérative"
                rules={[
                  {
                    required: true,
                    message: "Enter le nom de la coopérative",
                  },
                ]}
                initialValue={nom}
              >
                <Input
                  placeholder="Enter le nom de la coopérative"
                  name="cooperative"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sigle"
                label="En sigle"
                rules={[{ required: true, message: "En sigle" }]}
                initialValue={sigle}
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Entrer le sigle de la coopérative"
                  name="sigle"
                  value={sigle}
                  onChange={(e) => setSigle(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="id_responsable"
                label="Responsable"
                rules={[
                  {
                    required: true,
                    message: "Entrez le responsable",
                  },
                ]}
              >
                <Select
                  placeholder="Entrez le responsable"
                  onChange={handleRespoChange}
                >
                  {dataIdentification?.data?.rows.map((item, i) =>
                    item.__tbl_ecom_roles?.map((el) => {
                      if (el.role === "Responsable") {
                        return (
                          <Option
                            key={i}
                            value={item.id}
                          >{`${item.nom} ${item.postnom}`}</Option>
                        );
                      }
                    })
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="id_adjoint"
                label="Responsable Adjoint"
                rules={[
                  {
                    required: true,
                    message: "Entrez le responsable adjoint",
                  },
                ]}
              >
                <Select
                  placeholder="Entrez le responsable adjoint"
                  onChange={handleAdjointChange}
                >
                  {dataIdentification?.data?.rows.map((item, i) =>
                    item.__tbl_ecom_roles?.map((el) => {
                      if (el.role === "Responsable Adjoint") {
                        return (
                          <Option
                            key={i}
                            value={item.id}
                          >{`${item.nom} ${item.postnom}`}</Option>
                        );
                      }
                    })
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Entrez l'addresse email",
                  },
                ]}
              >
                <Input
                  name="email"
                  style={{ width: "100%" }}
                  placeholder="Entrez l'addresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="phone"
                label="Téléphone"
                rules={[
                  {
                    required: true,
                    message: "Entez le numero de téléphone",
                  },
                ]}
              >
                {/* <PhoneInput
                          inputStyle={{
                            width: '100%',
                            color: 'black'
                          } as React.CSSProperties}
                          inputClass={'form-control'}
                          country={'cd'}
                          value={phone}
                          onChange={changePhoneNumber}
                          enableSearch={true}
                          countryCodeEditable={true}
                          autoFormat={false}
                        /> */}

                <Input
                  style={{ width: "100%" }}
                  placeholder="Entez le numero de telephone"
                  name="phone"
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* <Col span={12}>
                      <Form.Item
                        name="gender"
                        label="Num. Enregistrement"
                        rules={[
                          {
                            required: true,
                            message: "Entrez le genre",
                          },
                        ]}
                      >
                        <Input
                          style={{ width: "100%" }}
                          placeholder="Entrez le genre"
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </Col> */}

            <Col span={12}>
              <Form.Item
                name="isformel"
                label="Formalisation"
                rules={[
                  {
                    required: true,
                    message: "Entrez la formalisation ",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  onChange={handleFormalChange}
                >
                  <Option value="">Formalisation</Option>
                  {options.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="id_category"
                label="Categorie"
                rules={[
                  {
                    required: true,
                    message: "Entrez la categirie",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  onChange={handleCategorieChange}
                >
                  <Option value="">Categorie</Option>
                  {dataCategCooperative?.data.rows.map((option, i) => (
                    <Option key={i} value={option?.id}>
                      {option?.category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>

            {
              isformel == 1 &&
              <Col span={12}>
                <Form.Item
                  name="file"
                  label="Attacher le fichier"
                  rules={[
                    {
                      required: true,
                      message: "Attacher le fichier",
                    },
                  ]}

                >
                  <Input
                    type="file"
                    style={{ width: "100%" }}
                      accept="application/pdf"
                    placeholder="Attacher le fichier"
                    onChange={handleFichierUpload}
                  />
                </Form.Item>
              </Col>
            }

            <Col span={12}>
              <Form.Item
                name="id_province"
                label="Province"
                rules={[
                  {
                    required: true,
                    message: "Entrez le province ",
                  },
                ]}
              >
                <Select
                  placeholder="Entrez le province"
                  onChange={handleProvinceChange}
                  showSearch
                  filterOption={(input: string, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {dataProvince?.data?.rows?.map((item, i) => (
                    <Option
                      key={i}
                      value={item.id}
                    >{`${item.province}`}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>


          </Row>
          <Row gutter={16}>

            <Col span={12}>
              <Form.Item
                name="id_territoire"
                label="Territoire"
                rules={[
                  {
                    required: true,
                    message: "Entrez le territoire ",
                  },
                ]}
              >
                <Select
                  placeholder="Entrez le territoire"
                  onChange={handleTerritoirChange}
                  showSearch
                  filterOption={(input: string, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }

                >
                  {selectedProvinceId &&
                    dataTerritoire?.data?.rows
                      .filter(
                        (item) => item.idprovince === selectedProvinceId
                      )
                      .map((item, index) => (
                        <Option key={index} value={item.id}>
                          {item.territoire}
                        </Option>
                      ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="village"
                label="Village"
                rules={[
                  {
                    required: true,
                    message: "Entrez le village ",
                  },
                ]}
              >
                <Select
                  placeholder="Entrez le village"
                  onChange={handleVillage}
                  showSearch
                  filterOption={(input: string, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {selectedTerritoirId &&
                    dataVillage?.data?.rows
                      .filter(
                        (item) =>
                          item.idterritoire === selectedTerritoirId
                      )
                      .map((item, index) => (
                        <Option key={index} value={item.id}>
                          {item.village}
                        </Option>
                      ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="logo"
                label="Logo"
                rules={[
                  {
                    required: true,
                    message: "Entrez le logo ",
                  },
                ]}
              >
                <div className="col" style={{ marginTop: 15 }}>
                  <Image
                    className='form-control'
                    src={image_default || image_default_name}
                    style={{ width: 150 }}
                    alt=""
                  />
                  <br />
                  <label className={'badge bg-primary'} style={{ color: 'white' }}>
                    Attacher le logo
                    <input type='file' style={{ display: 'none' }} onChange={handleImageUpload} />
                  </label>
                </div>
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "Entrez la description",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Entrez la description"
                  name="description"
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="adresse"
                label="Adresse"
                rules={[
                  {
                    required: true,
                    message: "Entrez l'adresse ",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Entrez l'adresse"
                  name="adresse"
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>

            
          </Row>
        </Form>
      </Drawer>
      <FileModal isModalOpen={isModalOpen1} handleOk={handleOk} handleCancel={handleCancel1} file={file} title={`Document  ${title}`} />

      <Modal
        title={`Liste des membres pour la cooperatives ${coop}`}
        open={showDialogMembre}
        onOk={handleOk1}
        onCancel={handleCancel2}
        footer={null}
        maskClosable={false}
        width={1600}
      >

        <div>
          <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
            <Input.Search
              placeholder="Rechercher un agriculteur"
              className="placeholder:!text-xs"
              onSearch={(v) => setSearchedTextAgri(v)}
              onChange={(e) => setSearchedTextAgri(e.target.value)}
            />
            <Button onClick={showDrawerAgri}>Ajouter un Agriculteur </Button>
            <Button
              onClick={() => generateAgriculteurMemberPdfparCooperative(`Liste des agriculteurs`, `${coop}`, filteredDataAgri)}
            >
              <FiPrinter />Imprimer
            </Button>
          </div>
          <Table
            dataSource={loarUser}
            loading={dataCooperativeLoad}
            className=" h-[70vh] overflow-auto"
            columns={[
              {
                title: "N°",
                dataIndex: "index",
                key: "index",
                render: (_, __, index) => index + 1,
                width: "3rem",
              },
              {
                title: "Nom complet",
                dataIndex: "name",
                key: "name",
                render: (_, item, _index) => (
                  <>
                    <List.Item.Meta
                      className=" flex items-center gap-4"
                      avatar={<Avatar />}
                      title={<strong>{`${item?.nom} ${item?.postnom} ${item?.prenom}`}</strong>}
                      description={<span className="text-[#3D843C]">ID : {item?.__tbl_ecom_hasmembers?.id}</span>}
                    />
                  </>
                ),
              },
              {
                title: "Telephone",
                dataIndex: "tel",
                key: "tel",
                render: (_, item, _index) => <a>{item?.phone}</a>,
              },
              {
                title: "Email",
                dataIndex: "tel",
                key: "tel",
                render: (_, item, _index) => <a>{item?.email}</a>,
              },
              {
                title: "Date de création",
                dataIndex: "date",
                key: "date",
                render: (_, item) => (
                  <a>{frenchFormattedDate(item?.__tbl_ecom_hasmembers?.createdAt)}</a>
                ),
              },

            ]}

            locale={{
              emptyText: 'Aucun membre affecté',
            }}

          />
        </div>

      </Modal>

      <Drawer
        maskClosable={false}
        title={`Ajouter de membres dans ${coop}`}
        width={720}
        onClose={onClose}
        open={openAgri}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            {/* <Button onClick={onClose}>Cancel</Button> */}
            <Button onClick={handleSubmitMembre}>
              {loadAddAgri ? (
                <Loader />
              ) : (
                "Enregistrer"
              )}
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            {/* <Col span={24}>
              <Form.Item
                name="cooperative"
                label="Coopérative"
                rules={[
                  {
                    required: true,
                    message: "Entrez le nom de la coopérative",
                  },
                ]}
              >
                <Select showSearch style={{ width: "100%" }} dropdownStyle={{ height: 200 }}

                  placeholder="Selectionnez cooperative" optionFilterProp="children"

                  filterOption={(input: string, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }

                  //  mode="tags"
                  onChange={handleCoopChange}
                >
                  <Option selected value="">Coopérative
                  </Option>
                  {
                    dataCooperative?.data?.rows?.map((item, i) => (
                      <Option key={i} value={item.id}>{item.cooperative}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col> */}
            <Col span={24}>
              <Form.Item
                name="ids_members"
                label="Membres"
                rules={[{ required: true, message: "Séléctionnez des membres" }]}
              >
                <Select
                  style={{ width: "100%" }}
                  mode="tags"
                  placeholder="Séléctionnez des membres"
                  showSearch
                  filterOption={(input: string, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={handleMembreChange}
                >
                  <Option selected value="">Liste...</Option>
                  {
                    dataIdentification &&
                      dataIdentification !== undefined ?
                      dataIdentification?.data?.rows?.map((item, i) => (
                        <Option key={i} value={item.id}>{`${item.nom} ${item.postnom} `}</Option>
                      ))
                      : ""
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </Drawer>

    </div>


  );
};

export default Home;
