"use client"
import Loader from '@/components/global/loader/Loader';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { baseURL } from '@/controller/api/config/baseUrl';
import { carousels } from '@/controller/api/constant/apiLink';
import useAuth from '@/controller/hooks/useAuth';
import { _carousels } from '@/controller/tanstack/carourels/getCarousel.service';
import { CarouselCredentials } from '@/types';
import LayoutCompWithTable from '@/view/model/LayoutCompWithTable'
import { Col, Drawer, Form, Input, Row, Space, Image, Pagination, Card, Popconfirm } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import logo from "../../../../components/images/HewAgrii.png"
import useDeleteCarousel from '@/controller/tanstack/carourels/useDeleteCarousel';
import { useForm } from 'antd/lib/form/Form';

const Carousel = () => {
    const { token } = useAuth();
    const [open, setOpen] = useState(false);
    const [image_default, setImageDefault] = useState<string>(logo.src); // Initialiser avec le logo
    const [saveFile, setSaveFile] = useState<File | null>(null);
    const [image_default_name, setImageDefaultName] = useState('')
    const [isLoading, setIsLoadingAddCarousel] = useState(false)
    const [id, setId] = useState(Number)
    const [openModif, setOpenModif] = useState(false);
    const { data: dataCarousel, isLoading: dataCarouselLoad, refetch } = useQuery(
        "auth-profil",
        () => _carousels(token!)
    );
    const [credentials, setCredentials] = useState<CarouselCredentials>({
        carousel: "",
        title: "",
        sub_title: "",
        description: ""
    });
    
    // const [formCarousel] = Form.useForm();
    // const handleImageUpload = (event: any) => {
    //     const file = event.target.files[0];
    //     setImageDefault(URL.createObjectURL(file));
    //     setSaveFile(event.target.files[0]);
    // };
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageDefault(URL.createObjectURL(file));
            setSaveFile(file);
            setIsLoadingAddCarousel(false);
        }
    };
    const showDrawer = () => {
        setOpen(true);
        setIsLoadingAddCarousel(false);
    };
    const onClose = () => {
        setOpen(false);
        setOpenModif(false);
        setCredentials({
            ...credentials,
            carousel: "",
            title: "",
            sub_title: "",
            description: ""
        });
        setImageDefault(logo.src)
    };
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value,
        }));
    };

    const {
        mutateAsync: _deleteCarousel
    } = useDeleteCarousel();


    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('sub_title', credentials?.sub_title || '');
        formData.append('description', credentials?.description || '');
        if (saveFile) {
            formData.append('carousel', saveFile);
        }
        formData.append('title', credentials?.title || '');

        setIsLoadingAddCarousel(true)

        if (credentials?.title === '') {
            toast({
                description: `Assurer vous d'avoir completez tout les champs requis !`,
            });
        } else {
            try {
                const response = await axios.post(
                    baseURL + `${carousels?.addCarousel}`,
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
                        carousel: "",
                        title: "",
                        sub_title: "",
                        description: ""
                    });

                    refetch();
                    setOpen(false);
                } else {
                    setIsLoadingAddCarousel(false)
                    toast({
                        description: `${json.message}`,
                    });
                }
            } catch (error: any) {
                setIsLoadingAddCarousel(false);
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

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append('sub_title', credentials?.sub_title || '');
        formData.append('description', credentials?.description || '');
        if (saveFile) {
            formData.append('carousel', saveFile);
        } else {
            // Si aucune nouvelle image n'est sélectionnée, utilisez l'image existante
            formData.append('carousel', credentials?.carousel || '');
        }
        formData.append('title', credentials?.title || '');

        setIsLoadingAddCarousel(true)

        if (credentials?.title === '') {
            toast({
                description: `Assurer vous d'avoir completez tout les champs requis !`,
            });
            setIsLoadingAddCarousel(false);
        } else {
            try {
                const response = await axios.put(
                    baseURL + `${carousels?.updateCarousel(id)}`,
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
                        carousel: "",
                        title: "",
                        sub_title: "",
                        description: ""
                    });

                    refetch();
                    setOpen(false);
                } else {
                    setIsLoadingAddCarousel(false)
                    toast({
                        description: `${json.message}`,
                    });
                }
            } catch (error: any) {
                setIsLoadingAddCarousel(false);
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


    const handleDelete = async (id: number) => {
        try {
            await _deleteCarousel({ useid: id, token: token! });
            refetch();
        } catch (error) {
            console.error("Erreur lors de la suppresion :", error);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Vérifiez que dataCarousel et ses propriétés sont définies
    const count = dataCarousel?.data?.count || 0; // Défaut à 0 si undefined
    const rows = dataCarousel?.data?.rows || []; // Défaut à un tableau vide si undefined

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = rows.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(count / itemsPerPage);

    // État pour gérer les descriptions complètes
    const [showFullDescriptions, setShowFullDescriptions] = useState(
        Array(rows.length).fill(false)
    );

    const toggleDescription = (index: any) => {
        const newShowFullDescriptions = [...showFullDescriptions];
        newShowFullDescriptions[index] = !newShowFullDescriptions[index];
        setShowFullDescriptions(newShowFullDescriptions);
    };
   
    const [formCarousel] = useForm<CarouselCredentials>()
    const showDrawerModif = (element: any) => {
        setId(element?.id);
        if (element?.carousel && typeof element.carousel === 'string') {
            setImageDefault(baseURL + '/' + element?.carousel);
        }
        setCredentials({
            carousel: element?.carousel || '',
            title: element?.title || '',
            sub_title: element?.sub_title || '',
            description: element?.description || '',
        });

        setOpenModif(true);
    };

    useEffect(() => {
        if (openModif) {
            formCarousel.setFieldsValue(credentials); // Mettez à jour les valeurs du formulaire
        }
    }, [openModif, credentials]);
    return (
        <div>
            <LayoutCompWithTable
                title="Liste de carousels"
                btn={
                    <>
                        <>

                            <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
                                {/* <Input.Search
                                    placeholder="Rechercher une cooperative"
                                    className="placeholder:!text-xs"
                                    onSearch={(v) => setSearchedText(v)}
                                    onChange={(e) => setSearchedText(e.target.value)}
                                /> */}
                                <Button onClick={showDrawer}>Ajouter une carousele</Button>
                                {/* <Button onClick={() => generateCooperativePdf('Liste des cooperatives', filteredData)}><FiPrinter />Imprimer</Button> */}
                            </div>
                            <Drawer
                                title="Ajouter une carousele"
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
                                            <label><span className="text-red-600">*</span>Titre</label>
                                            <Form.Item
                                                name="title"
                                                // label="Coopérative"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Enter le titre du carousel",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    placeholder="Enter le titre du carousel"
                                                    name="title"
                                                    onChange={handleChange}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="sub_title"
                                                label="Sous Titre"
                                                rules={[{ required: true, message: "En sigle" }]}
                                            >
                                                <Input
                                                    style={{ width: "100%" }}
                                                    placeholder="Entrer le sous titre du carousel"
                                                    name="sub_title"
                                                    onChange={handleChange}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>

                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="description"
                                                label="Description"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Entrez l'adresse email",
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea
                                                    style={{ width: "100%" }}
                                                    placeholder="Entrez la description"
                                                    name="description"
                                                    onChange={handleChange}
                                                    rows={4}
                                                />
                                            </Form.Item>
                                        </Col>

                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="carousel"
                                                label="Carousel Image"
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
                                                        src={image_default}
                                                        style={{ width: 150, height: 'auto' }}
                                                        alt=""
                                                    />
                                                    <br />
                                                    <label className={'badge bg-primary rounded-md cursor-pointer'} style={{ color: 'white', padding: 4 }}>
                                                        Attacher Image du carousel
                                                        <input type='file' style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
                                                    </label>
                                                </div>
                                            </Form.Item>
                                        </Col>

                                    </Row>

                                </Form>
                            </Drawer>
                        </>
                    </>
                }
                content={
                    <>
                        <div className="container mx-auto p-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {currentItems.map((item, index) => {
                                    const truncatedDescription = item.description.length > 100
                                        ? `${item.description.slice(0, 100)}...`
                                        : item.description;

                                    return (
                                        <Card key={item.id} className="shadow-md">
                                            <Image
                                                src={`${baseURL}/${item?.carousel}`}
                                                alt={item.title}
                                                className="w-full h-40 object-cover"
                                                preview={false}
                                            />
                                            <h3 className="text-xl font-semibold mt-2">{item.title}</h3>
                                            <p className="text-gray-600">{item.sub_title}</p>
                                            <p className="text-gray-800">
                                                {showFullDescriptions[index] ? item.description : truncatedDescription}
                                                {item.description.length > 100 && (
                                                    <span
                                                        onClick={() => toggleDescription(index)}
                                                        className="ml-2 cursor-pointer text-[#3D843C] text-md"
                                                    >
                                                        {showFullDescriptions[index] ? "Voir moins" : "Voir plus"}
                                                    </span>
                                                )}
                                            </p>
                                            <div className="flex justify-between mt-4">

                                                <Button onClick={() => showDrawerModif(item)}>Modifier</Button>

                                                <Popconfirm
                                                    placement="bottom"
                                                    title="Suppression utilisateur"
                                                    description="Voulez-vous vraiment supprimer cette carousel"
                                                    okText="Supprimer"
                                                    cancelText="NON"
                                                    onConfirm={() => handleDelete(item?.id)}
                                                >

                                                    <Button onClick={() => { }}>Supprimer</Button>
                                                </Popconfirm>

                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <span>
                                    Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, count)} sur {count} éléments
                                </span>
                                <Pagination
                                    current={currentPage}
                                    total={count}
                                    pageSize={itemsPerPage}
                                    onChange={(page) => setCurrentPage(page)}
                                    className="mt-4"
                                />
                            </div>
                        </div>
                    </>
                }
            />

            <Drawer
                title="Modifier une carousele"
                width={720}
                onClose={onClose}
                open={openModif}
                maskClosable={false}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        {/* <Button onClick={onClose}>Cancel</Button> */}
                        <Button onClick={() => handleUpdate()}>
                            {isLoading ? <Loader /> : "Modifier"}
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" hideRequiredMark form={formCarousel}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <label><span className="text-red-600">*</span>Titre</label>
                            <Form.Item
                                name="title"
                                // label="Coopérative"
                                rules={[
                                    {
                                        required: true,
                                        message: "Enter le titre du carousel",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Enter le titre du carousel"
                                    name="title"
                                    onChange={handleChange}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="sub_title"
                                label="Sous Titre"
                                rules={[{ required: true, message: "En sigle" }]}
                            >
                                <Input
                                    style={{ width: "100%" }}
                                    placeholder="Entrer le sous titre du carousel"
                                    name="sub_title"
                                    onChange={handleChange}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>

                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    {
                                        required: true,
                                        message: "Entrez la description", // Message d'erreur pour la validation
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    style={{ width: "100%" }}
                                    placeholder="Entrez la description"
                                    name="description"
                                    onChange={handleChange}
                                    rows={4}
                                />
                            </Form.Item>
                        </Col>

                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="carousel"
                                label="Carousel Image"
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
                                        style={{ width: 150, height: 'auto' }}
                                        alt=""
                                    />
                                    <br />
                                    <label className={'badge bg-primary rounded-md cursor-pointer'} style={{ color: 'white', padding: 4 }}>
                                        Attacher Image du carousel
                                        <input type='file' style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </Form.Item>
                        </Col>

                    </Row>

                </Form>
            </Drawer>
        </div>
    )
}

export default Carousel